import type { DiscountType } from "@prisma/client";

export function calculateDiscount(subtotal: number, type: DiscountType, value: number): number {
  if (subtotal <= 0 || value <= 0) return 0;
  return type === "PERCENTAGE"
    ? subtotal * Math.min(value, 100) / 100
    : Math.min(value, subtotal);
}
