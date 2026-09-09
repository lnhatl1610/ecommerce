import type { RouteObject } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";

export const authRoutes: RouteObject = { element: <AuthLayout />, children: [
  { path: "login", lazy: async () => ({ Component: (await import("@/features/auth/pages/LoginPage")).LoginPage }) },
  { path: "register", lazy: async () => ({ Component: (await import("@/features/auth/pages/RegisterPage")).RegisterPage }) },
  { path: "forgot-password", lazy: async () => ({ Component: (await import("@/features/auth/pages/ForgotPasswordPage")).ForgotPasswordPage }) },
  { path: "reset-password", lazy: async () => ({ Component: (await import("@/features/auth/pages/ResetPasswordPage")).ResetPasswordPage }) },
] };
