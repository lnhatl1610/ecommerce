import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import { OrderService } from "./order.service.js";
import type { CheckoutDTO } from "./order.dto.js";

export class OrderController {
  private readonly service: OrderService;
  constructor(service?: OrderService) { this.service = service ?? new OrderService(); }
  private userId(req: Request): string { return req.user?.userId ?? ""; }
  private error(res: Response, error: unknown): Response {
    const message = error instanceof Error ? error.message : "Order operation failed";
    const status = message.includes("empty") || message.includes("stock") || message.includes("transition") ? 409 : message.includes("not found") ? 404 : 500;
    return sendError(res, message, status);
  }

  checkout = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.checkout(this.userId(req), req.body as CheckoutDTO), "Order created successfully", 201); }
    catch (error: unknown) { return this.error(res, error); }
  };
  list = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.role === "ADMIN" || req.user?.role === "STAFF" ? undefined : this.userId(req);
      return sendSuccess(res, await this.service.list(userId), "Orders fetched successfully");
    }
    catch (error: unknown) { return this.error(res, error); }
  };
  getById = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.role === "ADMIN" || req.user?.role === "STAFF" ? undefined : this.userId(req);
      const order = await this.service.findById(req.params.id as string, userId);
      return order ? sendSuccess(res, order, "Order fetched successfully") : sendError(res, "Order not found", 404);
    } catch (error: unknown) { return this.error(res, error); }
  };
  updateStatus = async (req: Request, res: Response) => {
    try {
      const order = await this.service.updateStatus(req.params.id as string, req.body, this.userId(req));
      return order ? sendSuccess(res, order, "Order status updated") : sendError(res, "Order not found", 404);
    } catch (error: unknown) { return this.error(res, error); }
  };
}
