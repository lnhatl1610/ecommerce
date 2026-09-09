import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { accountApi } from "@/features/account/api/accountApi";
import { formatDate, formatMoney } from "@/lib/formatters";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { StatusBadge } from "@/features/account/components/StatusBadge";

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const { data: order, isLoading } = useQuery({ queryKey: ["order", id], queryFn: () => accountApi.order(id), enabled: Boolean(id) });
  if (isLoading) return <p>Đang tải đơn hàng...</p>;
  if (!order) return <p>Không tìm thấy đơn hàng.</p>;
  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"]; const stepIndex = steps.indexOf(order.status);
  return <div><h1 className="text-3xl font-black sm:text-4xl">Chi tiết đơn hàng</h1><div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-black/50">Mã đơn</p><strong>#{order.id.slice(0, 8)}</strong><p className="mt-2 text-sm text-black/50">{formatDate(order.createdAt)} · {order.paymentMethod}</p></div><StatusBadge status={order.status} /></div><div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">{steps.map((step, index) => <div key={step} className="text-center"><div className={`mx-auto size-3 rounded-full ${stepIndex >= index ? "bg-black" : "bg-black/15"}`} /><p className="mt-2 text-[11px] text-black/55">{getOrderStatusLabel(step)}</p></div>)}</div>{order.items && <div className="mt-8 border-t border-black/10 pt-5"><h2 className="font-bold">Sản phẩm</h2>{order.items.map((item) => <div key={item.id} className="mt-3 flex justify-between text-sm"><span>{item.quantity} × {item.variant?.sku ?? "Sản phẩm"}</span><strong>{formatMoney(item.priceAtPurchase * item.quantity)}</strong></div>)}</div>}<div className="mt-6 flex justify-between border-t border-black/10 pt-5 text-xl"><span>Tổng cộng</span><strong>{formatMoney(order.totalAmount)}</strong></div></div></div>;
}
