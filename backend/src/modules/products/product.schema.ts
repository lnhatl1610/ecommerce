import { z } from "zod";

export const createProductVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  attributes: z.record(z.string(), z.any()).default({}),
  price: z.number().positive("Price must be greater than 0"),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative").default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Product description is required"),
  shortDescription: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID"),
  basePrice: z.number().positive("Base price must be greater than 0"),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("ACTIVE"),
  variants: z.array(createProductVariantSchema).optional(),
  images: z.array(z.string().url("Invalid image URL")).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  slug: z.string().optional(),
  description: z.string().min(1, "Product description is required").optional(),
  shortDescription: z.string().optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  basePrice: z.number().positive("Base price must be greater than 0").optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
