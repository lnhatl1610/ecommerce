import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, CreditCard, MapPin, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addressApi } from "@/features/addresses/api/addressApi";
import { checkoutApi } from "@/features/checkout/api/checkoutApi";
import { useCartStore } from "@/stores/cartStore";
import { cartApi } from "@/features/cart/api/cartApi";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatMoney } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CheckoutPage() {
  const storedCouponCode = useCartStore((state) => state.couponCode);
  const [couponCode, setCouponCode] = useState(storedCouponCode);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const { data: addresses = [] } = useQuery({ queryKey: ["addresses"], queryFn: addressApi.list });
  useEffect(() => { const preferred = addresses.find((address) => address.isDefault) ?? addresses[0]; if (preferred && !addressId) setAddressId(preferred.id); }, [addressId, addresses]);
  const subtotal = cart?.items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0) ?? 0;
  const delivery = subtotal > 0 ? 15_000 : 0;

  return <section className="mx-auto max-w-6xl"><h1 className="home-display text-4xl">Checkout</h1><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"><div className="space-y-6"><section className="rounded-2xl border border-black/10 p-5 sm:p-6"><div className="flex items-center gap-3"><MapPin size={20} /><h2 className="text-xl font-bold">Địa chỉ giao hàng</h2></div>{addresses.length === 0 ? <div className="mt-5 rounded-xl bg-black/5 p-4 text-sm">Bạn chưa có địa chỉ. <Link to="/account/addresses" className="font-semibold underline">Thêm địa chỉ</Link></div> : <div className="mt-5 grid gap-3">{addresses.map((address) => <label key={address.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${addressId === address.id ? "border-black" : "border-black/10"}`}><input type="radio" name="address" value={address.id} checked={addressId === address.id} onChange={() => setAddressId(address.id)} className="mt-1 accent-black" /><span className="text-sm"><strong>{address.recipientName} · {address.phone}</strong><span className="mt-1 block text-black/60">{address.detail}, {address.ward}, {address.district}, {address.province}</span></span></label>)}</div>}</section><section className="rounded-2xl border border-black/10 p-5 sm:p-6"><div className="flex items-center gap-3"><Truck size={20} /><h2 className="text-xl font-bold">Vận chuyển</h2></div><div className="mt-5 flex items-center justify-between rounded-xl border border-black p-4 text-sm"><span><strong>Giao hàng tiêu chuẩn</strong><span className="mt-1 block text-black/60">Dự kiến 3–5 ngày làm việc</span></span><span className="font-semibold">{formatMoney(delivery)}</span></div></section><section className="rounded-2xl border border-black/10 p-5 sm:p-6"><div className="flex items-center gap-3"><CreditCard size={20} /><h2 className="text-xl font-bold">Thanh toán</h2></div><div className="mt-5 space-y-3"><label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-black p-4 text-sm"><input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="accent-black" /> Thanh toán khi nhận hàng (COD)</label><label className="flex min-h-14 cursor-not-allowed items-center justify-between gap-3 rounded-xl border border-black/10 p-4 text-sm text-black/40"><span><input type="radio" disabled checked={paymentMethod === "STRIPE"} onChange={() => setPaymentMethod("STRIPE")} className="mr-3" />Stripe</span><span className="text-xs">Backend chưa cấu hình PaymentIntent</span></label></div></section></div><aside className="h-fit rounded-2xl border border-black/10 p-5 sm:p-6"><h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2><div className="mt-5 space-y-3 text-sm">{cart?.items.map((item) => <div key={item.id} className="flex justify-between gap-3"><span className="line-clamp-1 text-black/60">{item.quantity} × {item.variant.product.name}</span><strong>{formatMoney(item.variant.price * item.quantity)}</strong></div>)}</div><div className="mt-5 space-y-3 border-t border-black/10 pt-5"><div className="flex justify-between"><span className="text-black/60">Tạm tính</span><strong>{formatMoney(subtotal)}</strong></div><div className="flex justify-between"><span className="text-black/60">Phí vận chuyển</span><strong>{formatMoney(delivery)}</strong></div><div className="flex justify-between border-t border-black/10 pt-4 text-lg"><span>Tổng cộng</span><strong>{formatMoney(subtotal + delivery)}</strong></div></div><label className="mt-5 block"><span className="sr-only">Mã giảm giá</span><Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Mã giảm giá" /></label><Button className="mt-4 w-full" disabled={!cart?.items.length || !addressId || submitting} onClick={async () => { setSubmitting(true); try { const order = await checkoutApi.createOrder({ addressId, paymentMethod, couponCode: couponCode.trim() || undefined }); setCart(cart ? { ...cart, items: [] } : null); toast.success("Đặt hàng thành công."); navigate(`/order-confirmation?orderId=${order.id}`); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Không thể đặt hàng.")); void cartApi.get().then(setCart); } finally { setSubmitting(false); } }}>{submitting ? "Đang đặt hàng..." : <><Check size={17} className="mr-2" />Đặt hàng</>}</Button></aside></div></section>;
}
