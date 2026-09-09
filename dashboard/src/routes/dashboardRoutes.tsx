import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard";
import { ProductPage } from "@/features/products";
import { CategoriesPage } from "@/features/categories";
import { UserPage } from "@/features/users";
import { OrdersPage } from "@/features/orders";
import { CouponsPage } from "@/features/coupons";
import { ReviewsPage } from "@/features/reviews/ReviewsPage";
import { InventoryPage } from "@/features/inventory/InventoryPage";
import {
  AddressesPage,
  LoginPage,
  ResetPasswordPage,
  ProfilePage,
  ProtectedRoute,
} from "@/features/auth";

const dashboardRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      { path: "orders", element: <OrdersPage /> },
      { path: "coupons", element: <CouponsPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "inventory", element: <InventoryPage /> },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "addresses",
        element: <AddressesPage />,
      },
    ],
  },
];

export default dashboardRoutes;
