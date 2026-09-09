import { Router } from "express";
import { UserController } from "./user.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema, updateMeSchema } from "./user.schema.js";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/me", requireAuth, userController.getMe);
userRouter.put("/me", requireAuth, validateBody(updateMeSchema), userController.updateMe);

userRouter.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(createUserSchema),
  userController.createUser,
);
userRouter.get("/", requireAuth, requireRole("ADMIN", "STAFF"), userController.getAllUsers);
userRouter.get(
  "/email/:email",
  requireAuth,
  requireRole("ADMIN", "STAFF"),
  userController.getUserByEmail,
);
userRouter.get("/:id", requireAuth, requireRole("ADMIN", "STAFF"), userController.getUserById);
userRouter.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateBody(updateUserSchema),
  userController.updateUser,
);
userRouter.delete("/:id", requireAuth, requireRole("ADMIN"), userController.deleteUser);

export { userRouter };
