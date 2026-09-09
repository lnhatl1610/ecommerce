import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type { Category, Product } from "@/types/product";
import { apiClient } from "@/lib/apiClient";

interface ProductRecord extends Omit<Product, "images"> { images?: Array<string | { url: string }> }
export interface ProductFilters { search?: string; categoryId?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number; sortBy?: "basePrice" | "createdAt" | "name"; sortOrder?: "asc" | "desc" }
const normalizeProduct = (product: ProductRecord): Product => ({ ...product, images: product.images?.map((image) => typeof image === "string" ? image : image.url) ?? [] });

export const productApi = {
  list: async (params: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiEnvelope<PaginatedResponse<ProductRecord>>>("/products", { params: { limit: 12, ...params } });
    return { ...response.data.data, items: response.data.data.items.map(normalizeProduct) };
  },
  getBySlug: async (slug: string) => normalizeProduct((await apiClient.get<ApiEnvelope<ProductRecord>>(`/products/slug/${slug}`)).data.data),
  categories: async () => (await apiClient.get<ApiEnvelope<Category[]>>("/categories")).data.data,
};
