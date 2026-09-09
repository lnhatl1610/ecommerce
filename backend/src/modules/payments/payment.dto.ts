import type { PaymentStatus } from "@prisma/client";
export interface PaymentWebhookDTO { orderId: string; transactionId: string; amount: number; status: PaymentStatus; signature: string }
