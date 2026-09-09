import { EmptyState } from "@/components/feedback/EmptyState";
export function NotificationsPage() { return <div><h1 className="text-3xl font-black sm:text-4xl">Thông báo</h1><p className="mt-2 text-sm text-black/60">Cập nhật mới nhất về đơn hàng và ưu đãi.</p><div className="mt-6"><EmptyState title="Bạn đã xem hết thông báo" description="Thông báo mới sẽ được hiển thị tại đây." /></div></div>; }
