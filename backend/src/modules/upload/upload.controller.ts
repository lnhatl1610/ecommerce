import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../lib/response.js";
import type { CreateUploadSignatureDTO } from "./upload.dto.js";
import { UploadService } from "./upload.service.js";
export class UploadController { constructor(private readonly service: UploadService = new UploadService()) {} signature = (req: Request, res: Response) => { try { return sendSuccess(res, this.service.createSignature(req.body as CreateUploadSignatureDTO)); } catch (error: unknown) { return sendError(res, error instanceof Error ? error.message : "Upload configuration failed", 503); } }; }
