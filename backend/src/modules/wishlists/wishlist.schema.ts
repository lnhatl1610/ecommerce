import { z } from "zod";
export const createWishlistSchema = z.object({ productId: z.string().uuid() });
