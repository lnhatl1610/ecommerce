import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider } from "@prisma/client";
import type { PaymentWebhookDTO } from "./payment.dto.js";
import { PaymentRepository } from "./payment.repository.js";
export class PaymentService {
  constructor(private readonly repository: PaymentRepository = new PaymentRepository()) {}
  async handleWebhook(provider: PaymentProvider, data: PaymentWebhookDTO) {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) throw new Error("Payment webhook is not configured");
    const content = `${provider}:${data.orderId}:${data.transactionId}:${data.amount}:${data.status}`;
    const expected = createHmac("sha256", secret).update(content).digest("hex");
    const valid = data.signature.length === expected.length && timingSafeEqual(Buffer.from(data.signature), Buffer.from(expected));
    if (!valid) throw new Error("Invalid webhook signature");
    const order = await this.repository.findOrder(data.orderId);
    if (!order) throw new Error("Order not found");
    if (order.paymentMethod !== provider || Math.abs(order.totalAmount - data.amount) > 0.001) throw new Error("Payment details do not match order");
    return this.repository.process(data.orderId, provider, data.transactionId, data.status);
  }
}
