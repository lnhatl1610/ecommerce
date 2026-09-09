import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState } from "@/components/feedback/EmptyState";
import { accountApi } from "@/features/account/api/accountApi";
import { ProductGrid } from "@/components/product/ProductGrid";
import { cartApi } from "@/features/cart/api/cartApi";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@/types/product";

export function WishlistPage() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);
  const wishlist = useQuery({ queryKey: ["wishlist"], queryFn: accountApi.wishlist });
  const remove = useMutation({ mutationFn: accountApi.removeWishlist, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["wishlist"] }); toast.success("Đã bỏ khỏi wishlist."); } });
  const products = wishlist.data?.map((item) => item.product) ?? [];
  const add = async (product: Product) => { const variant = product.variants[0]; if (variant) { setCart(await cartApi.add(variant.id)); toast.success("Đã thêm vào giỏ hàng."); } };
  return <div><h1 className="text-3xl font-black sm:text-4xl">Wishlist</h1><p className="mt-2 text-sm text-black/60">Những sản phẩm bạn đã lưu.</p><div className="mt-6">{products.length ? <ProductGrid products={products} onAdd={add} onWishlist={(product) => remove.mutate(product.id)} /> : wishlist.isLoading ? <p>Đang tải...</p> : <EmptyState title="Wishlist đang trống" />}</div></div>;
}
