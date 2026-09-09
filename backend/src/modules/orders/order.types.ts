import type { Address, Order, OrderItem, OrderStatus, OrderStatusHistory, Payment, ProductVariant } from "@prisma/client";

export interface OrderItemWithVariant extends OrderItem {
  variant: ProductVariant;
}

export interface OrderWithDetails extends Order {
  items: OrderItemWithVariant[];
  payments: Payment[];
  address: Address | null;
  statusHistory: OrderStatusHistory[];
}

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "PAID", "PAYMENT_FAILED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "SHIPPING", "CANCELLED"],
  PAID: ["PROCESSING", "SHIPPED", "SHIPPING", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED", "DELIVERY_FAILED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "DELIVERY_FAILED"],
  SHIPPING: ["OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED", "DELIVERY_FAILED"],
  DELIVERED: ["COMPLETED", "RETURN_REQUESTED"],
  COMPLETED: [],
  PAYMENT_FAILED: ["PENDING", "CONFIRMED", "CANCELLED"],
  CANCELLED: [],
  RETURN_REQUESTED: ["RETURN_PROCESSING", "CANCELLED"],
  RETURN_PROCESSING: ["REFUNDED", "PARTIALLY_REFUNDED"],
  REFUNDED: [],
  PARTIALLY_REFUNDED: [],
  DELIVERY_FAILED: ["SHIPPED", "OUT_FOR_DELIVERY", "CANCELLED"],
};
