import type { ProductStatus } from "./product.types.js";

export interface CreateProductVariantDTO {
  sku: string;
  attributes?: Record<string, string | number | boolean | null>;
  price: number;
  stockQuantity?: number;
}

export interface UpdateProductVariantDTO {
  sku?: string;
  attributes?: Record<string, string | number | boolean | null>;
  price?: number;
  stockQuantity?: number;
}

export interface CreateProductDTO {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  basePrice: number;
  thumbnail?: string;
  status?: ProductStatus;
  variants?: CreateProductVariantDTO[];
  images?: string[];
  sku?: string;
}

export interface UpdateProductDTO {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  categoryId?: string;
  basePrice?: number;
  thumbnail?: string;
  status?: ProductStatus;
  sku?: string;
}
