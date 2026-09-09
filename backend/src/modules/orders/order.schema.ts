import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().uuid("Invalid address ID").optional(),
  paymentMethod: z.enum(["COD", "VNPAY", "MOMO", "STRIPE"]),
  couponCode: z.string().trim().min(1).max(50).transform((value) => value.toUpperCase()).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "PAID", "SHIPPED", "OUT_FOR_DELIVERY", "SHIPPING", "DELIVERED", "COMPLETED", "PAYMENT_FAILED", "CANCELLED", "RETURN_REQUESTED", "RETURN_PROCESSING", "REFUNDED", "PARTIALLY_REFUNDED", "DELIVERY_FAILED"]),
  note: z.string().trim().max(500).optional(),
  trackingNumber: z.string().trim().max(120).optional(),
  cancellationReason: z.string().trim().max(500).optional(),
  deliveryFailedReason: z.string().trim().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
