import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "../src/stores/cartStore";
import type { Cart } from "../src/types/cart";

const cart: Cart = { id: "cart-1", items: [{ id: "item-1", quantity: 2, variant: { id: "variant-1", sku: "SKU-1", price: 100, stockQuantity: 5, attributes: {}, product: { id: "product-1", name: "Test Shirt", slug: "test-shirt", thumbnail: null } } }] };

describe("cartStore", () => {
  beforeEach(() => useCartStore.setState({ cart: null, couponCode: "" }));
  it("counts all cart item quantities", () => { useCartStore.getState().setCart(cart); expect(useCartStore.getState().itemCount()).toBe(2); });
  it("stores a checkout coupon code", () => { useCartStore.getState().setCouponCode("SAVE20"); expect(useCartStore.getState().couponCode).toBe("SAVE20"); });
});
