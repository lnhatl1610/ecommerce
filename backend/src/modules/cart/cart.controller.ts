import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import { CartService } from "./cart.service.js";
import type { CartOwner } from "./cart.types.js";
import type { AddCartItemDTO, UpdateCartItemDTO } from "./cart.dto.js";

export const GUEST_CART_COOKIE = "guestCartId";

export class CartController {
  private readonly service: CartService;

  constructor(service?: CartService) { this.service = service ?? new CartService(); }

  private owner(req: Request, res: Response): CartOwner {
    if (req.user) return { userId: req.user.userId };
    let sessionId = req.cookies?.[GUEST_CART_COOKIE] as string | undefined;
    if (!sessionId) {
      sessionId = this.service.createSessionId();
      res.cookie(GUEST_CART_COOKIE, sessionId, { httpOnly: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    return { sessionId };
  }

  getCart = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.getOrCreate(this.owner(req, res)), "Cart fetched successfully"); }
    catch (error: unknown) { return sendError(res, "Failed to fetch cart", 500, error instanceof Error ? error.message : null); }
  };

  addItem = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.addItem(this.owner(req, res), req.body as AddCartItemDTO), "Item added to cart", 201); }
    catch (error: unknown) { return this.handleError(res, error); }
  };

  updateItem = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.updateItem(this.owner(req, res), req.params.id as string, req.body as UpdateCartItemDTO), "Cart item updated"); }
    catch (error: unknown) { return this.handleError(res, error); }
  };

  removeItem = async (req: Request, res: Response) => {
    try { return sendSuccess(res, await this.service.removeItem(this.owner(req, res), req.params.id as string), "Cart item removed"); }
    catch (error: unknown) { return this.handleError(res, error); }
  };

  merge = async (req: Request, res: Response) => {
    try {
      const sessionId = req.cookies?.[GUEST_CART_COOKIE] as string | undefined;
      if (!req.user || !sessionId) return sendSuccess(res, await this.service.getOrCreate({ userId: req.user?.userId }), "Cart merged successfully");
      const cart = await this.service.mergeGuestCart(req.user.userId, sessionId);
      res.clearCookie(GUEST_CART_COOKIE);
      return sendSuccess(res, cart, "Cart merged successfully");
    } catch (error: unknown) { return this.handleError(res, error); }
  };

  private handleError(res: Response, error: unknown): Response {
    const message = error instanceof Error ? error.message : "Cart operation failed";
    const status = message.includes("not found") ? 404 : message.includes("stock") ? 409 : 500;
    return sendError(res, message, status);
  }
}
