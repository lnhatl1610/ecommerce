import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { accountApi } from "@/features/account/api/accountApi";
import { formatMoney } from "@/lib/formatters";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export function OrderConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const { data: order, isLoading } = useQuery({ queryKey: ["order", orderId], queryFn: () => accountApi.order(orderId), enabled: Boolean(orderId) });
  if (isLoading) return <p className="py-20 text-center">Đang xác nhận đơn hàng...</p>;
  if (!order) return <p className="py-20 text-center">Không tìm thấy thông tin đơn hàng.</p>;
  return <section className="mx-auto max-w-xl py-10 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={64} /><h1 className="mt-5 text-3xl font-black">Đặt hàng thành công</h1><p className="mt-3 text-black/60">Cảm ơn bạn. Đơn hàng đã được tiếp nhận và đang chờ xử lý.</p><div className="mt-7 rounded-2xl bg-black/5 p-6 text-left"><div className="flex justify-between"><span>Mã đơn</span><strong>#{order.id.slice(0, 8)}</strong></div><div className="mt-3 flex justify-between"><span>Trạng thái</span><strong>{getOrderStatusLabel(order.status)}</strong></div><div className="mt-3 flex justify-between"><span>Tổng cộng</span><strong>{formatMoney(order.totalAmount)}</strong></div></div><div className="mt-7 flex justify-center gap-3"><Link to={`/account/orders/${order.id}`} className="inline-flex min-h-11 items-center rounded-full bg-black px-6 text-sm text-white">Xem đơn hàng</Link><Link to="/shop" className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-6 text-sm">Tiếp tục mua sắm</Link></div></section>;
}
