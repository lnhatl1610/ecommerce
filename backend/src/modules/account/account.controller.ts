import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import { AccountService } from "./account.service.js";
export class AccountController { constructor(private readonly service = new AccountService()) {} overview = async (req: Request, res: Response) => { try { if (!req.user) return sendError(res, "Authentication required", 401); return sendSuccess(res, await this.service.getOverview(req.user.userId), "Account overview fetched successfully"); } catch (error: unknown) { const message = error instanceof Error ? error.message : "Failed to fetch account overview"; return sendError(res, message === "User not found" ? message : "Failed to fetch account overview", message === "User not found" ? 404 : 500); } }; }
