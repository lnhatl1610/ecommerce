import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  ShoppingCart,
  TicketPercent,
  Tags,
  Warehouse,
  Star,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import Logo from "../components/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/features/auth/services/authService";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const getInitials = (name?: string) => {
  const initials = (name ?? "User").trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2);
  return initials.toUpperCase();
};

const siderItems = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "users", icon: Users, label: "Users" },
  { key: "products", icon: Package, label: "Products" },
  { key: "categories", icon: Tags, label: "Categories" },
  { key: "orders", icon: ShoppingCart, label: "Orders" },
  { key: "coupons", icon: TicketPercent, label: "Coupons" },
  { key: "inventory", icon: Warehouse, label: "Inventory" },
  { key: "reviews", icon: Star, label: "Reviews" },
  { key: "profile", icon: UserRound, label: "Profile" },
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("dashboard-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const { accessToken } = await authService.refresh();
        useAuthStore.getState().setAccessToken(accessToken);
      } catch {
        // A transient network failure must not log the user out. The API
        // interceptor retries again when a protected request receives 401.
      }
    };
    // Access tokens live for 15 minutes; refresh them every 5 minutes so a
    // normal page visit never reaches the expiry boundary.
    const refreshTimer = window.setInterval(() => { void refresh(); }, 5 * 60 * 1000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local session even if API fails
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="dashboard-header flex h-16 shrink-0 items-center justify-between bg-gray-900 px-4 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Mở menu điều hướng" className="rounded-md p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white md:hidden"><Menu size={20} /></button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button type="button" onClick={() => { setNotificationsOpen((open) => !open); setSettingsOpen(false); }} aria-expanded={notificationsOpen} aria-haspopup="menu" aria-label="Mở thông báo" className="relative rounded-md p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"><Bell size={18} /></button>
            {notificationsOpen && <div role="menu" className="absolute right-0 top-12 z-30 w-72 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg"><div className="mb-3 flex items-center justify-between"><span className="font-semibold">Thông báo</span><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">0 mới</span></div><div className="rounded-md bg-gray-50 p-4 text-center text-gray-500">Chưa có thông báo mới.</div></div>}
          </div>
          <div className="relative">
            <button type="button" onClick={() => { setSettingsOpen((open) => !open); setNotificationsOpen(false); }} aria-expanded={settingsOpen} aria-haspopup="menu" aria-label="Mở cài đặt" className="rounded-md p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"><Settings size={18} /></button>
            {settingsOpen && <div role="menu" className="absolute right-0 top-12 z-30 w-64 rounded-lg border border-gray-200 bg-white p-1.5 text-sm text-gray-700 shadow-lg"><div className="flex items-center gap-3 border-b px-3 py-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">{getInitials(user?.name)}</span><div className="min-w-0"><p className="truncate font-semibold">{user?.name ?? "User"}</p><p className="truncate text-xs text-gray-500">{user?.email}</p></div></div><button type="button" role="menuitem" onClick={() => setDarkMode((enabled) => !enabled)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-100"><span className="text-gray-500" aria-hidden="true">{darkMode ? <Sun size={16} /> : <Moon size={16} />}</span>{darkMode ? "Giao diện sáng" : "Giao diện tối"}</button><button type="button" role="menuitem" onClick={() => { setSettingsOpen(false); navigate("/profile"); }} className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100">Hồ sơ tài khoản</button><button type="button" role="menuitem" onClick={() => { setSettingsOpen(false); void handleLogout(); }} className="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50">Đăng xuất</button><div className="mt-1 border-t px-3 py-2 text-xs text-gray-500">Admin Portal v1.0.0</div></div>}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {mobileOpen && <button type="button" aria-label="Đóng menu điều hướng" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:static md:z-auto md:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            collapsed ? "md:w-14" : "md:w-48",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-3 md:h-12">
          {!collapsed && <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Điều hướng</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            type="button"
            aria-label={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
            className="ml-auto rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Đóng menu điều hướng" className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"><X size={18} /></button>
          </div>

          <nav className="flex flex-col gap-1 p-2">
            {siderItems.map(({ key, icon: Icon, label }) => {
              const isActive = location.pathname.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => { navigate(`/${key}`); setMobileOpen(false); }}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="dashboard-main flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-6 min-h-full shadow-sm">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-500">
        <span>© {new Date().getFullYear()} Nhat Design</span>
        <span aria-hidden="true">·</span>
        <span>Admin Portal v1.0.0</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />System operational</span>
      </footer>
    </div>
  );
};
