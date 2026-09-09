import { randomUUID } from "node:crypto";
import { CartRepository } from "./cart.repository.js";
import prisma from "../../config/db.js";
import type { AddCartItemDTO, UpdateCartItemDTO } from "./cart.dto.js";
import type { CartOwner, CartWithItems } from "./cart.types.js";

export class CartService {
  private readonly repository: CartRepository;

  constructor(repository?: CartRepository) {
    this.repository = repository ?? new CartRepository();
  }

  async getOrCreate(owner: CartOwner): Promise<CartWithItems> {
    const existing = await this.repository.find(owner);
    return existing ?? this.repository.create(owner);
  }

  async addItem(owner: CartOwner, data: AddCartItemDTO): Promise<CartWithItems> {
    const variant = await prisma.productVariant.findUnique({ where: { id: data.variantId } });
    if (!variant) throw new Error("Product variant not found");
    const cart = await this.getOrCreate(owner);
    const current = cart.items.find((item) => item.variantId === data.variantId)?.quantity ?? 0;
    if (current + data.quantity > await this.availableStock(data.variantId, cart.id)) throw new Error("Insufficient stock");
    const updated = await this.repository.upsertItem(cart.id, data);
    await this.syncReservation(cart.id, data.variantId, current + data.quantity);
    return updated;
  }

  async updateItem(owner: CartOwner, itemId: string, data: UpdateCartItemDTO): Promise<CartWithItems> {
    const cart = await this.getOrCreate(owner);
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) throw new Error("Cart item not found");
    if (data.quantity > await this.availableStock(item.variantId, cart.id)) throw new Error("Insufficient stock");
    const updated = await this.repository.updateItem(cart.id, itemId, data);
    if (!updated) throw new Error("Cart item not found");
    await this.syncReservation(cart.id, item.variantId, data.quantity);
    return updated;
  }

  async removeItem(owner: CartOwner, itemId: string): Promise<CartWithItems> {
    const cart = await this.getOrCreate(owner);
    const item = cart.items.find((entry) => entry.id === itemId);
    if (!item) throw new Error("Cart item not found");
    const updated = await this.repository.removeItem(cart.id, itemId);
    if (!updated) throw new Error("Cart item not found");
    await prisma.stockReservation.deleteMany({ where: { cartId: cart.id, variantId: item.variantId } });
    return updated;
  }

  async mergeGuestCart(userId: string, sessionId: string): Promise<CartWithItems> {
    const userCart = await this.getOrCreate({ userId });
    const guestCart = await this.repository.find({ sessionId });
    if (!guestCart) return userCart;
    const stockByVariant = new Map(
      (await prisma.productVariant.findMany({
        where: { id: { in: guestCart.items.map((item) => item.variantId) } },
        select: { id: true, stockQuantity: true },
      })).map((variant) => [variant.id, variant.stockQuantity]),
    );
    const merged = await this.repository.merge(guestCart.id, userCart.id);
    for (const item of merged.items) {
      const stock = stockByVariant.get(item.variantId);
      if (stock !== undefined && item.quantity > stock) {
        if (stock === 0) await this.repository.removeItem(merged.id, item.id);
        else await this.repository.updateItem(merged.id, item.id, { quantity: stock });
      }
    }
    const finalCart = await this.getOrCreate({ userId });
    for (const item of finalCart.items) await this.syncReservation(finalCart.id, item.variantId, item.quantity);
    return finalCart;
  }

  private async availableStock(variantId: string, cartId: string): Promise<number> {
    await prisma.stockReservation.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    const [variant, reserved] = await Promise.all([
      prisma.productVariant.findUniqueOrThrow({ where: { id: variantId }, select: { stockQuantity: true } }),
      prisma.stockReservation.aggregate({ where: { variantId, expiresAt: { gt: new Date() }, NOT: { cartId } }, _sum: { quantity: true } }),
    ]);
    return Math.max(0, variant.stockQuantity - (reserved._sum.quantity ?? 0));
  }

  private async syncReservation(cartId: string, variantId: string, quantity: number): Promise<void> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.stockReservation.upsert({ where: { cartId_variantId: { cartId, variantId } }, create: { cartId, variantId, quantity, expiresAt }, update: { quantity, expiresAt } });
  }

  createSessionId(): string { return randomUUID(); }
}
