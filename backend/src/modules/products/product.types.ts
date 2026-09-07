import type {
  Product as PrismaProduct,
  Category,
  ProductVariant,
  ProductImage,
  ProductStatus,
} from "@prisma/client";

export type { ProductStatus };

export interface Product extends PrismaProduct { }

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductWithDetails extends Product {
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  page?: number;
  limit?: number;
  sortBy?: "basePrice" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedProducts {
  items: ProductWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
