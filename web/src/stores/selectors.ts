export const selectCartItems = (state: { cart: { items: unknown[] } | null }) => state.cart?.items ?? [];
