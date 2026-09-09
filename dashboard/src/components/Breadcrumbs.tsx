import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const labels: Record<string, string> = { dashboard: "Dashboard", products: "Sản phẩm", categories: "Danh mục", orders: "Đơn hàng", coupons: "Coupon", users: "Người dùng", profile: "Hồ sơ", addresses: "Địa chỉ" };

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const key = pathname.split("/")[1] || "dashboard";
  return <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-500"><Link to="/dashboard" aria-label="Về Dashboard" className="rounded p-1 hover:bg-gray-100"><Home size={14} /></Link><ChevronRight size={13} aria-hidden="true" /><span className="font-medium text-gray-700 dark:text-gray-300">{labels[key] ?? key}</span></nav>;
}
