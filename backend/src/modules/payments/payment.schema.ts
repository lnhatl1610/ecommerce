import { z } from "zod";
export const paymentWebhookSchema = z.object({ orderId: z.string().uuid(), transactionId: z.string().trim().min(1).max(200), amount: z.number().nonnegative(), status: z.enum(["SUCCESS", "FAILED", "REFUNDED"]), signature: z.string().regex(/^[a-f0-9]{64}$/i) });
