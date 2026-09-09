import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { UploadController } from "./upload.controller.js";
import { uploadSignatureSchema } from "./upload.schema.js";
const uploadRouter = Router(); const controller = new UploadController(); uploadRouter.post("/signature", requireAuth, requireRole("ADMIN", "STAFF"), validateBody(uploadSignatureSchema), controller.signature); export { uploadRouter };
