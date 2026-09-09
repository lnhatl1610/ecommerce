export interface Coupon { id: string; code: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number; minOrderValue: number; validFrom: string; validTo: string; usageLimit: number; usedCount: number; isActive: boolean }
export type CouponInput = Omit<Coupon, "id" | "usedCount">;
