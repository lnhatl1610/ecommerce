import { EmptyState } from "@/components/feedback/EmptyState";
export function CouponsPage() { return <div><h1 className="text-3xl font-black sm:text-4xl">Voucher của tôi</h1><p className="mt-2 text-sm text-black/60">Lưu và sử dụng ưu đãi cho đơn hàng tiếp theo.</p><div className="mt-6"><EmptyState title="Chưa có voucher" description="Voucher bạn nhận được sẽ hiển thị tại đây." /></div></div>; }
