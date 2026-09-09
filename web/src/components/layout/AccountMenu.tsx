import { Heart, LogIn, LogOut, MapPin, Package, UserPlus, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

const initials = (name: string) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toUpperCase()).join("");

export function AccountMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const clearSession = useAuthStore((state) => state.clearSession);
  const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const openOnHover = () => {
    if (!canHover()) return;
    clearCloseTimer();
    setOpen(true);
  };
  const closeOnHover = () => {
    if (!canHover()) return;
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 160);
  };
  const go = (path: string) => () => {
    setOpen(false);
    navigate(path);
  };

  useEffect(() => () => clearCloseTimer(), []);

  return <DropdownMenu open={open} onOpenChange={setOpen}><DropdownMenuTrigger render={<button type="button" className="flex min-h-11 items-center gap-2 rounded-full outline-none ring-black/15 transition hover:bg-black/5 focus-visible:ring-2" aria-label={authenticated ? `Mở menu tài khoản của ${user?.name ?? "bạn"}` : "Mở menu đăng nhập"} onPointerEnter={openOnHover} onPointerLeave={closeOnHover} />}>
    {authenticated && user ? <><span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-black text-xs font-bold text-white">{user.logoUrl || user.avatar ? <img src={user.logoUrl ?? user.avatar ?? ""} alt="" className="h-full w-full object-cover" /> : initials(user.name)}</span><span className="hidden max-w-28 truncate pr-2 text-sm font-medium xl:block">{user.name}</span></> : <span className="flex size-11 items-center justify-center"><UserRound size={22} aria-hidden="true" /></span>}
  </DropdownMenuTrigger><DropdownMenuContent onPointerEnter={openOnHover} onPointerLeave={closeOnHover}>
    {authenticated && user ? <><DropdownMenuLabel><span className="block">Xin chào,</span><strong className="mt-0.5 block truncate text-sm text-black">{user.name}</strong><span className="mt-0.5 block truncate">{user.email}</span></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={go("/account/orders")}><Package />Đơn hàng của tôi</DropdownMenuItem><DropdownMenuItem onClick={go("/account")}><UserRound />Thông tin tài khoản</DropdownMenuItem><DropdownMenuItem onClick={go("/account/addresses")}><MapPin />Sổ địa chỉ</DropdownMenuItem><DropdownMenuItem onClick={go("/account/wishlist")}><Heart />Danh sách yêu thích</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-600 hover:bg-red-50 focus:bg-red-50" onClick={async () => { setOpen(false); await authApi.logout().catch(() => undefined); clearSession(); toast.success("Đã đăng xuất."); navigate("/"); }}><LogOut />Đăng xuất</DropdownMenuItem></> : <><DropdownMenuLabel>Tài khoản SHOP.CO</DropdownMenuLabel><DropdownMenuItem onClick={go("/login")}><LogIn />Đăng nhập</DropdownMenuItem><DropdownMenuItem onClick={go("/register")}><UserPlus />Đăng ký</DropdownMenuItem></>}
  </DropdownMenuContent></DropdownMenu>;
}
