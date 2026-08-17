import { DashboardLayout } from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import ProductPage from "../pages/ProductPage";
import UserPage from "../pages/UserPage";

const dashboardRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
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
