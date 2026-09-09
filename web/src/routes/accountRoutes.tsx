import type { RouteObject } from "react-router-dom";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ProtectedRoute } from "@/app/routeGuards";

export const accountRoutes: RouteObject = { element: <ProtectedRoute />, children: [{ path: "account", element: <AccountLayout />, children: [
  { index: true, lazy: async () => ({ Component: (await import("@/features/account/pages/AccountPage")).AccountPage }) },
  { path: "profile", lazy: async () => ({ Component: (await import("@/features/account/pages/AccountPage")).AccountPage }) },
  { path: "profile/password", lazy: async () => ({ Component: (await import("@/features/account/pages/ChangePasswordPage")).ChangePasswordPage }) },
  { path: "orders", lazy: async () => ({ Component: (await import("@/features/account/pages/OrdersPage")).OrdersPage }) },
  { path: "orders/:id", lazy: async () => ({ Component: (await import("@/features/account/pages/OrderDetailPage")).OrderDetailPage }) },
  { path: "wishlist", lazy: async () => ({ Component: (await import("@/features/account/pages/WishlistPage")).WishlistPage }) },
  { path: "addresses", lazy: async () => ({ Component: (await import("@/features/addresses/pages/AddressPage")).AddressPage }) },
  { path: "reviews", lazy: async () => ({ Component: (await import("@/features/account/pages/ReviewsPage")).ReviewsPage }) },
  { path: "coupons", lazy: async () => ({ Component: (await import("@/features/account/pages/CouponsPage")).CouponsPage }) },
  { path: "notifications", lazy: async () => ({ Component: (await import("@/features/account/pages/NotificationsPage")).NotificationsPage }) },
] }] };
