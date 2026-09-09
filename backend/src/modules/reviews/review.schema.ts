import { z } from "zod";
export const createReviewSchema = z.object({ productId: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().trim().max(2000).optional() });
export const updateReviewSchema = z.object({ rating: z.number().int().min(1).max(5).optional(), comment: z.string().trim().max(2000).optional() }).refine((data) => Object.keys(data).length > 0, "At least one field is required");
