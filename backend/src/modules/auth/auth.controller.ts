import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { RegisterDTO, LoginDTO } from "./auth.types.js";
import { sendSuccess, sendError } from "../../lib/response.js";
import {
  getRefreshTokenCookieName,
  type AuthClient,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../../lib/cookies.js";

const getAuthClient = (req: Request): AuthClient => req.get("x-client-app") === "dashboard" ? "dashboard" : "storefront";

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService ?? new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const data: RegisterDTO = req.body;
      const { refreshToken, ...result } = await this.authService.register(data);
      setRefreshTokenCookie(res, refreshToken, getAuthClient(req));
      return sendSuccess(res, result, "Registration successful", 201);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      if (message === "Email already registered") {
        return sendError(res, message, 409);
      }
      return sendError(res, "Registration failed", 500, message);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data: LoginDTO = req.body;
      const { refreshToken, ...result } = await this.authService.login(data);
      setRefreshTokenCookie(res, refreshToken, getAuthClient(req));
      return sendSuccess(res, result, "Login successful");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      if (message === "Invalid email or password" || message === "Account is deactivated") {
        return sendError(res, message, 401);
      }
      return sendError(res, "Login failed", 500, message);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const tokenFromCookie = req.cookies?.[getRefreshTokenCookieName(getAuthClient(req))] as string | undefined;
      if (!tokenFromCookie) {
        return sendError(res, "Refresh token missing", 401);
      }

      const result = await this.authService.refreshToken(tokenFromCookie);
      return sendSuccess(res, result, "Token refreshed successfully");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Token refresh failed";
      clearRefreshTokenCookie(res);
      return sendError(res, "Token refresh failed", 401, message);
    }
  };

  logout = async (_req: Request, res: Response) => {
    clearRefreshTokenCookie(res);
    return sendSuccess(res, null, "Logout successful");
  };

  forgotPassword = async (req: Request, res: Response) => {
    try { await this.authService.forgotPassword(req.body.email as string); return sendSuccess(res, null, "If the account exists, a reset email has been sent"); }
    catch (error: unknown) { return sendError(res, "Unable to send reset email", 503, error instanceof Error ? error.message : null); }
  };

  resetPassword = async (req: Request, res: Response) => {
    try { await this.authService.resetPassword(req.body.token as string, req.body.password as string); return sendSuccess(res, null, "Password reset successfully"); }
    catch (error: unknown) { return sendError(res, error instanceof Error ? error.message : "Password reset failed", 400); }
  };

  changePassword = async (req: Request, res: Response) => {
    try { if (!req.user) return sendError(res, "Authentication required", 401); await this.authService.changePassword(req.user.userId, req.body.currentPassword as string, req.body.newPassword as string); return sendSuccess(res, null, "Password changed successfully"); }
    catch (error: unknown) { return sendError(res, error instanceof Error ? error.message : "Password change failed", 400); }
  };
}
