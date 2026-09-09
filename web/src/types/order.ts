import type { Address } from "./address";

export interface OrderItem { id: string; quantity: number; priceAtPurchase: number; variant?: { sku: string } }
export interface Order { id: string; status: string; totalAmount: number; paymentMethod: string; createdAt: string; address?: Address | null; items?: OrderItem[] }
