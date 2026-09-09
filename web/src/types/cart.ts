import type { Product, Variant } from "./product";
export interface CartItem { id: string; quantity: number; variant: Variant & { product: Pick<Product, "id" | "name" | "slug" | "thumbnail"> } }
export interface Cart { id: string; items: CartItem[] }
