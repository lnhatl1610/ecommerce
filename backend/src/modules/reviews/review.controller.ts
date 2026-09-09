import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import type { CreateReviewDTO, UpdateReviewDTO } from "./review.dto.js";
import { ReviewService } from "./review.service.js";
export class ReviewController {
  constructor(private readonly service: ReviewService = new ReviewService()) {}
  list = async (req: Request, res: Response) => { try { return sendSuccess(res, await this.service.list(req.params.productId as string)); } catch (error: unknown) { return this.fail(res, error); } };
  listAll = async (_req: Request, res: Response) => { try { return sendSuccess(res, await this.service.listAll()); } catch (error: unknown) { return this.fail(res, error); } };
  create = async (req: Request, res: Response) => { try { return sendSuccess(res, await this.service.create(req.user!.userId, req.body as CreateReviewDTO), "Review created", 201); } catch (error: unknown) { return this.fail(res, error); } };
  update = async (req: Request, res: Response) => { try { const review = await this.service.update(req.params.id as string, req.user!.userId, req.body as UpdateReviewDTO); return review ? sendSuccess(res, review) : sendError(res, "Review not found", 404); } catch (error: unknown) { return this.fail(res, error); } };
  delete = async (req: Request, res: Response) => { try { const owner = req.user!.role === "ADMIN" ? undefined : req.user!.userId; const review = await this.service.delete(req.params.id as string, owner); return review ? sendSuccess(res, null) : sendError(res, "Review not found", 404); } catch (error: unknown) { return this.fail(res, error); } };
  private fail(res: Response, error: unknown): Response { const message = error instanceof Error ? error.message : "Review operation failed"; return sendError(res, message, message.includes("verified") ? 403 : 409); }
}
