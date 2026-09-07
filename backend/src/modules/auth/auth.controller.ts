import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { RegisterDTO, LoginDTO, RefreshTokenDTO } from "./auth.types.js";
import { sendSuccess, sendError } from "../../lib/response.js";

export class AuthController {
  private authService: AuthService;

  constructor(authService?: AuthService) {
    this.authService = authService ?? new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.authService.register(data);
      return sendSuccess(res, result, "Registration successful", 201);
    } catch (err: any) {
      if (err.message === "Email already registered") {
        return sendError(res, err.message, 409);
      }
      return sendError(res, "Registration failed", 500, err.message ?? err);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.authService.login(data);
      return sendSuccess(res, result, "Login successful");
    } catch (err: any) {
      if (err.message === "Invalid email or password" || err.message === "Account is deactivated") {
        return sendError(res, err.message, 401);
      }
      return sendError(res, "Login failed", 500, err.message ?? err);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const data: RefreshTokenDTO = req.body;
      const result = await this.authService.refreshToken(data);
      return sendSuccess(res, result, "Token refreshed successfully");
    } catch (err: any) {
      return sendError(res, "Token refresh failed", 401, err.message ?? err);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      // In a real implementation, you would invalidate the refresh token
      // For now, we'll just return success
      return sendSuccess(res, null, "Logout successful");
    } catch (err: any) {
      return sendError(res, "Logout failed", 500, err.message ?? err);
    }
  };
}
