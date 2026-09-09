import { z } from "zod";
export const uploadSignatureSchema = z.object({ folder: z.string().regex(/^[a-zA-Z0-9/_-]+$/).max(100).default("ecommerce/products") });
