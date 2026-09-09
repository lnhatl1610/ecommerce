import { createHash } from "node:crypto";
import type { CreateUploadSignatureDTO } from "./upload.dto.js";
import type { UploadSignature } from "./upload.types.js";
import { UploadRepository } from "./upload.repository.js";
export class UploadService { constructor(private readonly repository: UploadRepository = new UploadRepository()) {} createSignature(data: CreateUploadSignatureDTO): UploadSignature { const config = this.repository.configuration(); if (!config.cloudName || !config.apiKey || !config.apiSecret) throw new Error("Cloudinary is not configured"); const timestamp = Math.floor(Date.now() / 1000); const folder = data.folder ?? "ecommerce/products"; const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${config.apiSecret}`).digest("hex"); return { cloudName: config.cloudName, apiKey: config.apiKey, timestamp, folder, signature }; } }
