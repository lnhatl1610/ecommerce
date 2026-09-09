import type { DiscountType } from "@prisma/client";

export interface CreateCouponDTO {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  isActive?: boolean;
}

export type UpdateCouponDTO = Partial<CreateCouponDTO>;

