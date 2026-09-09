import type { ApiEnvelope } from "@/types/api";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import { apiClient } from "@/lib/apiClient";

export interface AccountOverview { user: { name: string; email: string; avatarUrl: string | null }; stats: { totalOrders: number; pendingOrders: number; wishlistCount: number; rewardPoints: number }; recentOrders: Array<{ id: string; createdAt: string; status: string; total: number }>; }

export interface WishlistItem { id: string; productId: string; product: Product }
export const accountApi = {
  overview: async () => (await apiClient.get<ApiEnvelope<AccountOverview>>("/account/overview")).data.data,
  orders: async () => (await apiClient.get<ApiEnvelope<Order[]>>("/orders")).data.data,
  order: async (id: string) => (await apiClient.get<ApiEnvelope<Order>>(`/orders/${id}`)).data.data,
  wishlist: async () => (await apiClient.get<ApiEnvelope<WishlistItem[]>>("/wishlist")).data.data,
  addWishlist: async (productId: string) => (await apiClient.post<ApiEnvelope<WishlistItem>>("/wishlist", { productId })).data.data,
  removeWishlist: async (productId: string) => { await apiClient.delete(`/wishlist/${productId}`); },
};
