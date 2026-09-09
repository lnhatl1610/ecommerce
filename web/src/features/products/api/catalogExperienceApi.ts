import { apiClient } from "@/lib/apiClient";
import type { ApiEnvelope } from "@/types/api";
import type { Product } from "@/types/product";

export interface ProductExperience {
  brand: { id: string; name: string; slug: string; logoUrl?: string | null } | null;
  media: Array<{ id: string; variantId?: string | null; type: "IMAGE" | "VIDEO"; url: string; altText?: string | null; position: number }>;
  promotions: Array<{ id: string; name: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; startsAt: string; endsAt: string }>;
  bundles: Array<{ id: string; name: string; items: Array<{ componentProduct: Product }> }>;
  soldCount: number;
  viewCount: number;
}

export interface ProductAnswer { id: string; content: string; isOfficial: boolean; createdAt: string; user: { id: string; name: string; avatar?: string | null } }
export interface ProductQuestion { id: string; content: string; status: "PENDING" | "ANSWERED" | "HIDDEN"; createdAt: string; user: { id: string; name: string; avatar?: string | null }; answers: ProductAnswer[] }
export interface ShippingQuote { available: boolean; zoneName?: string; rates: Array<{ id: string; name: string; fee: number; minDays: number; maxDays: number }> }
export interface CreateReturnPayload { orderId: string; reason: string; items: Array<{ orderItemId: string; quantity: number; condition?: string }> }

export const catalogExperienceApi = {
  product: async (productId: string) => (await apiClient.get<ApiEnvelope<ProductExperience>>(`/experience/products/${productId}`)).data.data,
  recordView: async (productId: string, sessionId?: string) => { await apiClient.post(`/experience/products/${productId}/views`, { sessionId }); },
  questions: async (productId: string) => (await apiClient.get<ApiEnvelope<ProductQuestion[]>>(`/experience/products/${productId}/questions`)).data.data,
  createQuestion: async (productId: string, content: string) => (await apiClient.post<ApiEnvelope<ProductQuestion>>("/experience/questions", { productId, content })).data.data,
  shippingQuote: async (provinceCode: string, subtotal: number) => (await apiClient.get<ApiEnvelope<ShippingQuote>>("/experience/shipping/quote", { params: { provinceCode, subtotal } })).data.data,
  toggleHelpful: async (reviewId: string) => (await apiClient.post<ApiEnvelope<{ helpful: boolean }>>(`/experience/reviews/${reviewId}/helpful`)).data.data,
  returns: async () => (await apiClient.get<ApiEnvelope<unknown[]>>("/experience/returns")).data.data,
  createReturn: async (payload: CreateReturnPayload) => (await apiClient.post<ApiEnvelope<unknown>>("/experience/returns", payload)).data.data,
};
