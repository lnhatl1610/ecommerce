import type { PaymentProvider, PaymentStatus } from "@prisma/client";
import { PaymentDAO } from "./payment.dao.js";
export class PaymentRepository { constructor(private readonly dao: PaymentDAO = new PaymentDAO()) {} findOrder(orderId: string) { return this.dao.findOrder(orderId); } process(orderId: string, provider: PaymentProvider, transactionId: string, status: PaymentStatus) { return this.dao.process(orderId, provider, transactionId, status); } }
