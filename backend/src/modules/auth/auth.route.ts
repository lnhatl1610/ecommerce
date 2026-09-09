import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.dto.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authRateLimiter, refreshRateLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = Router();
const authController = new AuthController();

router.post("/register", authRateLimiter, validateBody(registerSchema), authController.register);
router.post("/login", authRateLimiter, validateBody(loginSchema), authController.login);
router.post("/refresh", refreshRateLimiter, authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", authRateLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authRateLimiter, validateBody(resetPasswordSchema), authController.resetPassword);
router.post("/change-password", requireAuth, validateBody(changePasswordSchema), authController.changePassword);

export { router as authRouter };
