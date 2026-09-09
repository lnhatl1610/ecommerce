import prisma from "../../config/db.js";
import type { PaymentProvider, PaymentStatus } from "@prisma/client";
export class PaymentDAO {
  findOrder(orderId: string) { return prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } }); }
  process(orderId: string, provider: PaymentProvider, transactionId: string, status: PaymentStatus) {
    return prisma.$transaction(async (transaction) => {
      const payment = await transaction.payment.findFirst({ where: { orderId, provider } });
      if (!payment) throw new Error("Payment not found");
      const updated = await transaction.payment.update({ where: { id: payment.id }, data: { transactionId, status } });
      if (status === "SUCCESS") await transaction.order.updateMany({ where: { id: orderId, status: "PENDING" }, data: { status: "PAID" } });
      return updated;
    });
  }
}
