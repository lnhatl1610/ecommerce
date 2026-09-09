import type { OrderStatus } from "@prisma/client";
export interface AccountOverview { user: { name: string; email: string; avatarUrl: string | null }; stats: { totalOrders: number; pendingOrders: number; wishlistCount: number; rewardPoints: number }; recentOrders: Array<{ id: string; createdAt: Date; status: OrderStatus; total: number }>; }
