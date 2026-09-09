import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { PaymentController } from "./payment.controller.js";
import { paymentWebhookSchema } from "./payment.schema.js";
const paymentRouter = Router(); const controller = new PaymentController(); paymentRouter.post("/webhook/:provider", validateBody(paymentWebhookSchema), controller.webhook); export { paymentRouter };
