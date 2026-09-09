import { Bell, ClipboardList, Heart, House, LogOut, MapPin, MessageSquareText, TicketPercent, UserRound, WalletCards } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";

const links = [
  { to: "/account", label: "Tổng quan", icon: House, end: true },
  { to: "/account/profile", label: "Thông tin tài khoản", icon: UserRound },
  { to: "/account/orders", label: "Đơn hàng của tôi", icon: ClipboardList },
  { to: "/account/addresses", label: "Sổ địa chỉ", icon: MapPin },
  { to: "/account/wishlist", label: "Sản phẩm yêu thích", icon: Heart },
  { to: "/account/reviews", label: "Đánh giá của tôi", icon: MessageSquareText },
  { to: "/account/coupons", label: "Voucher của tôi", icon: TicketPercent },
  { to: "/account/notifications", label: "Thông báo", icon: Bell },
  { to: "/account/profile/password", label: "Đổi mật khẩu", icon: WalletCards },
];

export function AccountNav({ mobile = false }: { mobile?: boolean }) {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const logout = async () => { await authApi.logout().catch(() => undefined); clearSession(); toast.success("Đã đăng xuất."); navigate("/"); };
  return <nav aria-label="Điều hướng tài khoản" className={mobile ? "grid gap-2" : "space-y-1"}>{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? "bg-black text-white" : "text-black/65 hover:bg-black/5 hover:text-black"}`}><Icon size={18} aria-hidden="true" /><span>{label}</span></NavLink>)}<button type="button" onClick={() => void logout()} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"><LogOut size={18} aria-hidden="true" />Đăng xuất</button></nav>;
}
