import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
