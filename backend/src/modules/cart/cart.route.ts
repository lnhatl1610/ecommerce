import { Router } from "express";
import { CartController } from "./cart.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { addCartItemSchema, updateCartItemSchema } from "./cart.schema.js";
import { optionalAuth, requireAuth } from "../../middlewares/auth.middleware.js";

const cartRouter = Router();
const controller = new CartController();

cartRouter.use(optionalAuth);

cartRouter.get("/", controller.getCart);
cartRouter.post("/items", validateBody(addCartItemSchema), controller.addItem);
cartRouter.put("/items/:id", validateBody(updateCartItemSchema), controller.updateItem);
cartRouter.delete("/items/:id", controller.removeItem);
cartRouter.post("/merge", requireAuth, controller.merge);

export { cartRouter };
