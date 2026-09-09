import type { ApiEnvelope } from "@/types/api";
import type { Cart } from "@/types/cart";
import { apiClient } from "@/lib/apiClient";
export const cartApi = { get: async () => (await apiClient.get<ApiEnvelope<Cart>>("/cart")).data.data, add: async (variantId: string, quantity = 1) => (await apiClient.post<ApiEnvelope<Cart>>("/cart/items", { variantId, quantity })).data.data, update: async (id: string, quantity: number) => (await apiClient.put<ApiEnvelope<Cart>>(`/cart/items/${id}`, { quantity })).data.data, remove: async (id: string) => (await apiClient.delete<ApiEnvelope<Cart>>(`/cart/items/${id}`)).data.data, merge: () => apiClient.post("/cart/merge") };
