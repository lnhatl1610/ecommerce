import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { CouponController } from "./coupon.controller.js";
import { createCouponSchema, updateCouponSchema } from "./coupon.schema.js";

const couponRouter = Router();
const controller = new CouponController();
couponRouter.use(requireAuth, requireRole("ADMIN", "STAFF"));
couponRouter.get("/", controller.list);
couponRouter.post("/", validateBody(createCouponSchema), controller.create);
couponRouter.put("/:id", validateBody(updateCouponSchema), controller.update);
couponRouter.delete("/:id", requireRole("ADMIN"), controller.delete);

export { couponRouter };

