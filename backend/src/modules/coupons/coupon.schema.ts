import { z } from "zod";

const couponFields = {
  code: z.string().trim().min(2).max(50).transform((value) => value.toUpperCase()),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderValue: z.number().nonnegative().default(0),
  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
  usageLimit: z.number().int().positive().default(100),
  isActive: z.boolean().default(true),
};

export const createCouponSchema = z.object(couponFields).refine(
  (data) => data.validTo > data.validFrom,
  { message: "validTo must be after validFrom", path: ["validTo"] },
).refine(
  (data) => data.discountType !== "PERCENTAGE" || data.discountValue <= 100,
  { message: "Percentage discount cannot exceed 100", path: ["discountValue"] },
);

export const updateCouponSchema = z.object(couponFields).partial();

