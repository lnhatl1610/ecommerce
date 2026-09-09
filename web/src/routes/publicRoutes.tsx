import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/app/routeGuards";

export const publicRoutes: RouteObject[] = [
  { index: true, lazy: async () => ({ Component: (await import("@/features/home/pages/HomePage")).HomePage }) },
  { path: "shop", lazy: async () => ({ Component: (await import("@/features/products/pages/CategoryPage")).CategoryPage }) },
  { path: "shop/:slug", lazy: async () => ({ Component: (await import("@/features/products/pages/CategoryPage")).CategoryPage }) },
  { path: "search", lazy: async () => ({ Component: (await import("@/features/products/pages/CategoryPage")).CategoryPage }) },
  { path: "products/:slug", lazy: async () => ({ Component: (await import("@/features/products/pages/ProductDetailPage")).ProductDetailPage }) },
  { path: "cart", lazy: async () => ({ Component: (await import("@/features/cart/components/CartPage")).CartPage }) },
  { element: <ProtectedRoute />, children: [
    { path: "checkout", lazy: async () => ({ Component: (await import("@/features/checkout/pages/CheckoutPage")).CheckoutPage }) },
    { path: "order-confirmation", lazy: async () => ({ Component: (await import("@/features/checkout/pages/OrderConfirmationPage")).OrderConfirmationPage }) },
  ] },
];
