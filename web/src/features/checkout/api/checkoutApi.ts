import type { ApiEnvelope } from "@/types/api";
import type { Order } from "@/types/order";
import { apiClient } from "@/lib/apiClient";

export interface CheckoutPayload { addressId: string; paymentMethod: "COD" | "STRIPE"; couponCode?: string }
export const checkoutApi = { createOrder: async (payload: CheckoutPayload) => (await apiClient.post<ApiEnvelope<Order>>("/orders", payload)).data.data };
