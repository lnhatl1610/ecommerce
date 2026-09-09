import type { Request, Response } from "express";
import type { PaymentProvider } from "@prisma/client";
import { sendError, sendSuccess } from "../../lib/response.js";
import type { PaymentWebhookDTO } from "./payment.dto.js";
import { PaymentService } from "./payment.service.js";
export class PaymentController { constructor(private readonly service: PaymentService = new PaymentService()) {} webhook = async (req: Request, res: Response) => { try { const payment = await this.service.handleWebhook((req.params.provider as string).toUpperCase() as PaymentProvider, req.body as PaymentWebhookDTO); return sendSuccess(res, payment, "Webhook processed"); } catch (error: unknown) { const message = error instanceof Error ? error.message : "Webhook failed"; return sendError(res, message, message.includes("signature") ? 401 : message.includes("not found") ? 404 : 409); } }; }
