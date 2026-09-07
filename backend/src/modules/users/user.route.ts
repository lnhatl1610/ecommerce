import { Router } from "express";
import { UserController } from "./user.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", validateBody(createUserSchema), userController.createUser);
userRouter.get("/", userController.getAllUsers);
userRouter.get("/email/:email", userController.getUserByEmail);
userRouter.get("/:id", userController.getUserById);
userRouter.put("/:id", validateBody(updateUserSchema), userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export { userRouter };
