import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard";
import { ProductPage } from "@/features/products";
import { UserPage } from "@/features/users";

const dashboardRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
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
    ],
  },
];

export default dashboardRoutes;
