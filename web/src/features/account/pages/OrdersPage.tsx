import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { accountApi } from "@/features/account/api/accountApi";
import { formatDate, formatMoney } from "@/lib/formatters";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { StatusBadge } from "@/features/account/components/StatusBadge";

export function OrdersPage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: accountApi.orders });
  return <div><h1 className="text-3xl font-black sm:text-4xl">Đơn hàng của tôi</h1><p className="mt-2 text-sm text-black/60">Theo dõi trạng thái và xem lại các đơn đã đặt.</p><div className="mt-6 flex gap-2 overflow-x-auto pb-1"><button type="button" className="whitespace-nowrap rounded-full bg-black px-4 py-2 text-sm text-white">Tất cả</button><span className="whitespace-nowrap rounded-full bg-black/5 px-4 py-2 text-sm">Chờ xác nhận</span><span className="whitespace-nowrap rounded-full bg-black/5 px-4 py-2 text-sm">Đang giao</span><span className="whitespace-nowrap rounded-full bg-black/5 px-4 py-2 text-sm">Đã giao</span><span className="whitespace-nowrap rounded-full bg-black/5 px-4 py-2 text-sm">Đã hủy</span></div>{orders.isError ? <div className="mt-6"><ErrorState message="Không thể tải đơn hàng." onRetry={() => void orders.refetch()} /></div> : orders.data?.length ? <div className="mt-4 space-y-3">{orders.data.map((order) => <Link to={`/account/orders/${order.id}`} key={order.id} className="flex min-h-24 items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black"><span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/5"><Package size={22} /></span><span className="min-w-0 flex-1"><strong className="block">Đơn #{order.id.slice(0, 8)}</strong><small className="mt-1 block text-black/50">{formatDate(order.createdAt)} · {order.items?.length ?? 0} sản phẩm</small></span><span className="flex shrink-0 flex-col items-end gap-2"><StatusBadge status={order.status} /><strong>{formatMoney(order.totalAmount)}</strong></span><ChevronRight size={18} /></Link>)}</div> : orders.isLoading ? <p className="mt-6">Đang tải...</p> : <div className="mt-6"><EmptyState title="Chưa có đơn hàng" /></div>}</div>;
}
