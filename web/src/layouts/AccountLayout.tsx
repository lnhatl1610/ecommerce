import { Outlet } from "react-router-dom";
import { PromoBar } from "@/components/layout/PromoBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ToastViewport } from "@/components/feedback/ToastViewport";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountNav } from "@/features/account/components/AccountNav";
import { useAuthStore } from "@/stores/authStore";

const initials = (name: string) => name.trim().split(/\s+/).slice(-2).map((part) => part[0]?.toUpperCase()).join("");

export function AccountLayout() {
  const user = useAuthStore((state) => state.user);
  return <div className="min-h-screen bg-[#fafafa] text-stone-900"><PromoBar /><SiteHeader /><MobileNavigation /><CartDrawer /><main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10"><div className="mb-8 text-sm text-black/50"><a href="/" className="hover:text-black">Trang chủ</a><span className="mx-2">/</span><span className="text-black">Tài khoản của tôi</span></div><div className="mb-5 md:hidden"><AccountNav mobile /></div><div className="grid gap-8 lg:grid-cols-[260px_1fr]"><aside className="hidden lg:block"><div className="sticky top-6 space-y-5"><div className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-center gap-3"><div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-bold text-white">{user?.logoUrl || user?.avatar ? <img src={user.logoUrl ?? user.avatar ?? ""} alt="" className="h-full w-full object-cover" /> : initials(user?.name ?? "U")}</div><div className="min-w-0"><p className="truncate font-bold">{user?.name}</p><p className="truncate text-xs text-black/50">{user?.email}</p><span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Thành viên</span></div></div></div><div className="rounded-2xl border border-black/10 bg-white p-3"><AccountNav /></div></div></aside><section className="min-w-0"><Outlet /></section></div></main><SiteFooter /><ToastViewport /></div>;
}
