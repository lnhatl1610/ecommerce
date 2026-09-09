import api from "@/lib/api";
import type { Order, OrderStatus } from "./types";
export const orderApi = { list: () => api.get<{ success: true; data: Order[] }>("/orders"), get: (id: string) => api.get<{ success: true; data: Order }>(`/orders/${id}`), updateStatus: (id: string, status: OrderStatus) => api.put<{ success: true; data: Order }>(`/orders/${id}/status`, { status }) };
