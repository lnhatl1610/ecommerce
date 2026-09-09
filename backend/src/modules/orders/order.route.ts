import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { OrderController } from "./order.controller.js";
import { checkoutSchema, updateOrderStatusSchema } from "./order.schema.js";

const orderRouter = Router();
const controller = new OrderController();

orderRouter.use(requireAuth);
orderRouter.post("/", validateBody(checkoutSchema), controller.checkout);
orderRouter.get("/", controller.list);
orderRouter.get("/:id", controller.getById);
orderRouter.put("/:id/status", requireRole("ADMIN", "STAFF"), validateBody(updateOrderStatusSchema), controller.updateStatus);

export { orderRouter };
