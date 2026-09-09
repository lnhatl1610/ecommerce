import prisma from "../../config/db.js";
import type { CheckoutDTO, UpdateOrderStatusDTO } from "./order.dto.js";
import type { OrderStatus } from "@prisma/client";
import type { OrderWithDetails } from "./order.types.js";
import { calculateDiscount } from "../../lib/pricing.js";

const orderInclude = {
  items: { include: { variant: true } },
  payments: true,
  address: true,
  statusHistory: { orderBy: { createdAt: "desc" as const } },
};

export class OrderDAO {
  async checkout(userId: string, data: CheckoutDTO): Promise<OrderWithDetails> {
    return prisma.$transaction(async (transaction) => {
      const cart = await transaction.cart.findUnique({ where: { userId }, include: { items: { include: { variant: { include: { product: { select: { categoryId: true } } } } } } } });
      if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

      if (data.addressId) {
        const address = await transaction.address.findFirst({ where: { id: data.addressId, userId } });
        if (!address) throw new Error("Address not found");
      }

      let totalAmount = 0;
      for (const item of cart.items) {
        const reservedByOthers = await transaction.stockReservation.aggregate({ where: { variantId: item.variantId, expiresAt: { gt: new Date() }, NOT: { cartId: cart.id } }, _sum: { quantity: true } });
        if (item.variant.stockQuantity - (reservedByOthers._sum.quantity ?? 0) < item.quantity) throw new Error(`Insufficient available stock for ${item.variant.sku}`);
        const updated = await transaction.productVariant.updateMany({
          where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (updated.count !== 1) throw new Error(`Insufficient stock for ${item.variant.sku}`);
        await transaction.inventoryTransaction.create({ data: { variantId: item.variantId, type: "SALE", quantity: -item.quantity, referenceId: cart.id } });
        totalAmount += item.variant.price * item.quantity;
      }

      let couponId: string | undefined;
      if (data.couponCode) {
        const now = new Date();
        const coupon = await transaction.coupon.findFirst({
          where: { code: data.couponCode, isActive: true, validFrom: { lte: now }, validTo: { gte: now } },
          include: { products: true, categories: true, usages: { where: { userId } } },
        });
        if (!coupon || coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon is invalid or expired");
        if (totalAmount < coupon.minOrderValue) throw new Error("Order does not meet coupon minimum value");
        if (coupon.usages.length > 0) throw new Error("Coupon already used by this account");
        const eligible = cart.items.some((item) => (coupon.products.length === 0 && coupon.categories.length === 0) || coupon.products.some((target) => target.productId === item.variant.productId) || coupon.categories.some((target) => target.categoryId === item.variant.product.categoryId));
        if (!eligible) throw new Error("Coupon does not apply to cart products");
        const discount = calculateDiscount(totalAmount, coupon.discountType, coupon.discountValue);
        totalAmount = Math.max(0, totalAmount - discount);
        couponId = coupon.id;
        const usage = await transaction.coupon.updateMany({ where: { id: coupon.id, usedCount: { lt: coupon.usageLimit } }, data: { usedCount: { increment: 1 } } });
        if (usage.count !== 1) throw new Error("Coupon usage limit reached");
      }

      const order = await transaction.order.create({
        data: {
          userId,
          addressId: data.addressId,
          totalAmount,
          couponId,
          paymentMethod: data.paymentMethod,
          items: {
            create: cart.items.map((item) => ({ variantId: item.variantId, quantity: item.quantity, priceAtPurchase: item.variant.price })),
          },
          payments: { create: { provider: data.paymentMethod, amount: totalAmount, status: "PENDING" } },
        },
        include: orderInclude,
      });
      await transaction.orderStatusHistory.create({ data: { orderId: order.id, toStatus: "PENDING", note: "Order created" } });
      if (couponId) await transaction.couponUsage.create({ data: { couponId, userId, orderId: order.id } });
      await transaction.stockReservation.deleteMany({ where: { cartId: cart.id } });
      await transaction.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }

  findById(id: string, userId?: string): Promise<OrderWithDetails | null> {
    return prisma.order.findFirst({ where: { id, ...(userId ? { userId } : {}) }, include: orderInclude });
  }

  findMany(userId?: string): Promise<OrderWithDetails[]> {
    return prisma.order.findMany({ where: userId ? { userId } : undefined, include: orderInclude, orderBy: { createdAt: "desc" } });
  }

  async updateStatus(id: string, data: UpdateOrderStatusDTO, changedById?: string): Promise<OrderWithDetails | null> {
    return prisma.$transaction(async (transaction) => {
      const order = await transaction.order.findUnique({ where: { id }, include: { items: true, coupon: true } });
      if (!order) return null;
      if (data.status === "CANCELLED" && order.status !== "CANCELLED") {
        for (const item of order.items) {
          await transaction.productVariant.update({ where: { id: item.variantId }, data: { stockQuantity: { increment: item.quantity } } });
          await transaction.inventoryTransaction.create({ data: { variantId: item.variantId, type: "RETURN", quantity: item.quantity, referenceId: order.id, note: "Order cancelled" } });
        }
        if (order.couponId) { await transaction.coupon.update({ where: { id: order.couponId }, data: { usedCount: { decrement: 1 } } }); await transaction.couponUsage.deleteMany({ where: { orderId: order.id } }); }
      }
      const timestamp = new Date();
      const updateData = {
        status: data.status,
        ...(data.trackingNumber ? { trackingNumber: data.trackingNumber } : {}),
        ...(data.cancellationReason ? { cancellationReason: data.cancellationReason } : {}),
        ...(data.deliveryFailedReason ? { deliveryFailedReason: data.deliveryFailedReason } : {}),
        ...(data.status === "CONFIRMED" ? { confirmedAt: timestamp } : {}),
        ...(data.status === "PROCESSING" ? { processingAt: timestamp } : {}),
        ...(["SHIPPED", "SHIPPING"].includes(data.status) ? { shippedAt: timestamp } : {}),
        ...(data.status === "DELIVERED" ? { deliveredAt: timestamp } : {}),
        ...(data.status === "PAYMENT_FAILED" ? { paymentFailedAt: timestamp } : {}),
        ...(data.status === "COMPLETED" ? { completedAt: timestamp } : {}),
      };
      const updated = await transaction.order.update({ where: { id }, data: updateData, include: orderInclude });
      await transaction.orderStatusHistory.create({ data: { orderId: id, fromStatus: order.status as OrderStatus, toStatus: data.status, note: data.note, changedById } });
      if (data.status === "PAYMENT_FAILED") await transaction.payment.updateMany({ where: { orderId: id }, data: { status: "FAILED" } });
      if (["REFUNDED", "PARTIALLY_REFUNDED"].includes(data.status)) await transaction.payment.updateMany({ where: { orderId: id }, data: { status: "REFUNDED" } });
      return updated;
    });
  }
}
