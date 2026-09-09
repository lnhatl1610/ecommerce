import { create } from "zustand";
import type { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  couponCode: string;
  setCart: (cart: Cart | null) => void;
  setCouponCode: (couponCode: string) => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  couponCode: "",
  setCart: (cart) => set({ cart }),
  setCouponCode: (couponCode) => set({ couponCode }),
  itemCount: () => get().cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
}));
