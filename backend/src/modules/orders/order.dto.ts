import type { OrderStatus, PaymentMethod } from "@prisma/client";

export interface CheckoutDTO {
  addressId?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string;
  trackingNumber?: string;
  cancellationReason?: string;
  deliveryFailedReason?: string;
}
