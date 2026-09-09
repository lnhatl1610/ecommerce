import type { Cart, CartItem, ProductVariant } from "@prisma/client";

export interface CartItemWithVariant extends CartItem {
  variant: ProductVariant & {
    product: {
      id: string;
      name: string;
      slug: string;
      thumbnail: string | null;
    };
  };
}

export interface CartWithItems extends Cart {
  items: CartItemWithVariant[];
}

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}
