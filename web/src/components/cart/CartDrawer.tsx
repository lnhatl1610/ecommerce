import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cartApi } from "@/features/cart/api/cartApi";
import { formatMoney } from "@/lib/formatters";
import { useCartStore } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/Sheet";

export function CartDrawer() {
  const open = useUiStore((state) => state.cartDrawerOpen);
  const close = useUiStore((state) => state.closeCartDrawer);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const subtotal = cart?.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0) ?? 0;
  return <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) close(); }}><SheetContent><SheetHeader><SheetTitle className="text-xl font-bold">Giỏ hàng ({cart?.items.length ?? 0})</SheetTitle><SheetDescription className="sr-only">Xem nhanh và cập nhật các sản phẩm trong giỏ hàng.</SheetDescription></SheetHeader><div className="flex-1 overflow-auto p-5">{cart?.items.length ? <div className="space-y-4">{cart.items.map((item) => <article key={item.id} className="flex gap-3 border-b border-black/10 pb-4"><div className="size-20 shrink-0 overflow-hidden rounded-xl bg-black/5">{item.variant.product.thumbnail && <img src={item.variant.product.thumbnail} alt={item.variant.product.name} className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="truncate text-sm font-bold">{item.variant.product.name}</h3><button aria-label="Xóa sản phẩm" onClick={() => void cartApi.remove(item.id).then(setCart)} className="flex size-11 items-center justify-center text-red-600"><Trash2 size={16} /></button></div><strong className="mt-1 block">{formatMoney(item.variant.price)}</strong><div className="mt-2 flex w-28 items-center justify-between rounded-full bg-black/5 px-1"><button disabled={item.quantity <= 1} onClick={() => void cartApi.update(item.id, item.quantity - 1).then(setCart)} aria-label="Giảm số lượng" className="size-10"><Minus size={14} /></button><span className="text-sm">{item.quantity}</span><button disabled={item.quantity >= item.variant.stockQuantity} onClick={() => void cartApi.update(item.id, item.quantity + 1).then(setCart)} aria-label="Tăng số lượng" className="size-10"><Plus size={14} /></button></div></div></article>)}</div> : <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag size={42} className="text-black/30" /><p className="mt-4 font-semibold">Giỏ hàng đang trống</p></div>}</div><SheetFooter><div className="flex justify-between text-lg"><span>Tạm tính</span><strong>{formatMoney(subtotal)}</strong></div><Link onClick={close} to="/cart" className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-black text-sm text-white">Xem giỏ hàng</Link><Button onClick={close} variant="outline" className="mt-3 w-full">Tiếp tục mua sắm</Button></SheetFooter></SheetContent></Sheet>;
}
