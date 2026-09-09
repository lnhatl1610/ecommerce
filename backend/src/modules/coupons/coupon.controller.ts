import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import type { CreateCouponDTO, UpdateCouponDTO } from "./coupon.dto.js";
import { CouponService } from "./coupon.service.js";

export class CouponController {
  constructor(private readonly service: CouponService = new CouponService()) {}
  list = async (_req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.list(), "Coupons fetched successfully"); }
    catch (error: unknown) { return this.fail(res, error); }
  };
  create = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.create(req.body as CreateCouponDTO), "Coupon created successfully", 201); }
    catch (error: unknown) { return this.fail(res, error); }
  };
  update = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.update(req.params.id as string, req.body as UpdateCouponDTO), "Coupon updated successfully"); }
    catch (error: unknown) { return this.fail(res, error); }
  };
  delete = async (req: Request, res: Response) => {
    try { await this.service.delete(req.params.id as string); return sendSuccess(res, null, "Coupon deleted successfully"); }
    catch (error: unknown) { return this.fail(res, error); }
  };
  private fail(res: Response, error: unknown): Response {
    const message = error instanceof Error ? error.message : "Coupon operation failed";
    return sendError(res, message, message.includes("already exists") ? 409 : 400);
  }
}

