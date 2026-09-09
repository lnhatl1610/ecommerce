import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PromoBar } from "@/components/layout/PromoBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { ToastViewport } from "@/components/feedback/ToastViewport";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cartApi } from "@/features/cart/api/cartApi";
import { useCartStore } from "@/stores/cartStore";
export function StorefrontLayout() { const setCart = useCartStore((state) => state.setCart); useEffect(() => { void cartApi.get().then(setCart).catch(() => setCart(null)); }, [setCart]); return <div className="min-h-screen bg-white text-stone-900"><PromoBar/><SiteHeader/><MobileNavigation/><CartDrawer/><main className="mx-auto max-w-7xl px-4 py-8 sm:px-8"><Outlet/></main><SiteFooter/><ToastViewport/></div>; }
