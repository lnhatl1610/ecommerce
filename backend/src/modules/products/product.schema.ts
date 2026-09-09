import { z } from "zod";

const jsonAttributeValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const createProductVariantSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  attributes: z.record(z.string(), jsonAttributeValueSchema).default({}),
  price: z.number().positive("Price must be greater than 0"),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative").default(0),
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

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

export const productQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "ALL"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(["basePrice", "createdAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
