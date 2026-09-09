import { z } from "zod";

export const addCartItemSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  quantity: z.number().int().positive().max(100),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(100),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
