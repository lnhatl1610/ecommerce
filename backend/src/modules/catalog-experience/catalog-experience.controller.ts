import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import type { ReturnStatus } from "@prisma/client";
import type { CreateAnswerDTO, CreateBrandDTO, CreateBundleDTO, CreateMediaDTO, CreatePromotionDTO, CreateQuestionDTO, CreateReturnDTO, CreateShippingZoneDTO, InventoryAdjustmentDTO, RecordProductViewDTO } from "./catalog-experience.dto.js";
import { CatalogExperienceService } from "./catalog-experience.service.js";

export class CatalogExperienceController {
  constructor(private readonly service = new CatalogExperienceService()) {}
  brands = async (_req: Request, res: Response) => sendSuccess(res, await this.service.listBrands());
  product = async (req: Request, res: Response) => { const data = await this.service.getProductExperience(req.params.productId as string); return data ? sendSuccess(res, data) : sendError(res, "Product not found", 404); };
  recordView = async (req: Request, res: Response) => { const body = req.body as RecordProductViewDTO; return sendSuccess(res, await this.service.recordView(req.params.productId as string, req.user?.userId, body.sessionId), "View recorded", 201); };
  questions = async (req: Request, res: Response) => sendSuccess(res, await this.service.listQuestions(req.params.productId as string));
  createQuestion = async (req: Request, res: Response) => { const body = req.body as CreateQuestionDTO; return sendSuccess(res, await this.service.createQuestion(req.user!.userId, body.productId, body.content), "Question created", 201); };
  createAnswer = async (req: Request, res: Response) => { const body = req.body as CreateAnswerDTO; return sendSuccess(res, await this.service.createAnswer(req.user!.userId, req.user!.role, req.params.questionId as string, body.content), "Answer created", 201); };
  shippingQuote = async (req: Request, res: Response) => sendSuccess(res, await this.service.shippingQuote(String(req.query.provinceCode), Number(req.query.subtotal ?? 0)));
  returns = async (req: Request, res: Response) => sendSuccess(res, await this.service.listReturns(req.user!.userId));
  createReturn = async (req: Request, res: Response) => { try { return sendSuccess(res, await this.service.createReturn(req.user!.userId, req.body as CreateReturnDTO), "Return requested", 201); } catch (error: unknown) { return sendError(res, error instanceof Error ? error.message : "Return failed", 400); } };
  helpful = async (req: Request, res: Response) => sendSuccess(res, await this.service.toggleReviewHelpful(req.params.reviewId as string, req.user!.userId));
  createBrand = async (req: Request, res: Response) => sendSuccess(res, await this.service.createBrand(req.body as CreateBrandDTO), "Brand created", 201);
  createMedia = async (req: Request, res: Response) => sendSuccess(res, await this.service.createMedia(req.body as CreateMediaDTO), "Media created", 201);
  deleteMedia = async (req: Request, res: Response) => { await this.service.deleteMedia(req.params.id as string); return sendSuccess(res, null, "Media deleted"); };
  createPromotion = async (req: Request, res: Response) => sendSuccess(res, await this.service.createPromotion(req.body as CreatePromotionDTO), "Promotion created", 201);
  createShippingZone = async (req: Request, res: Response) => sendSuccess(res, await this.service.createShippingZone(req.body as CreateShippingZoneDTO), "Shipping zone created", 201);
  createBundle = async (req: Request, res: Response) => sendSuccess(res, await this.service.createBundle(req.body as CreateBundleDTO), "Bundle created", 201);
  adjustInventory = async (req: Request, res: Response) => { try { return sendSuccess(res, await this.service.adjustInventory(req.body as InventoryAdjustmentDTO)); } catch (error: unknown) { return sendError(res, error instanceof Error ? error.message : "Inventory adjustment failed", 400); } };
  updateReturnStatus = async (req: Request, res: Response) => sendSuccess(res, await this.service.updateReturnStatus(req.params.id as string, req.body.status as ReturnStatus));
}
