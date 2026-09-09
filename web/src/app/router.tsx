import { createBrowserRouter } from "react-router-dom";
import { StorefrontLayout } from "@/layouts/StorefrontLayout";
import { publicRoutes } from "@/routes/publicRoutes";
import { authRoutes } from "@/routes/authRoutes";
import { accountRoutes } from "@/routes/accountRoutes";
import { NotFoundPage } from "@/components/feedback/NotFoundPage";
import { RouteErrorPage } from "@/components/feedback/RouteErrorPage";

export const router = createBrowserRouter([
  { element: <StorefrontLayout />, errorElement: <RouteErrorPage />, children: publicRoutes },
  { ...authRoutes, errorElement: <RouteErrorPage /> },
  { ...accountRoutes, errorElement: <RouteErrorPage /> },
  { path: "*", element: <NotFoundPage />, errorElement: <RouteErrorPage /> },
]);
