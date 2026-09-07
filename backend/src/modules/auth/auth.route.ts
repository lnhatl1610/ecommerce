import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.dto.js";

const router = Router();
const authController = new AuthController();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", validateBody(refreshTokenSchema), authController.refreshToken);
router.post("/logout", authController.logout);

export { router as authRouter };
