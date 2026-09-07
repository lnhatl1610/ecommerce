import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Package,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import Logo from '../components/Logo';
import { cn } from '@/lib/utils';

const siderItems = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'users', icon: Users, label: 'Users' },
    { key: 'products', icon: Package, label: 'Products' },
];

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 h-16 bg-gray-900 text-white shrink-0">
                <Logo />
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                    </button>
                    <button
                        className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                        aria-label="Settings"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shrink-0",
                        collapsed ? "w-14" : "w-48"
                    )}
                >
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "flex items-center h-12 px-3 text-gray-600 hover:bg-gray-100 transition-colors border-b border-gray-200",
                            collapsed ? "justify-center" : "justify-between"
                        )}
                    >
                        {!collapsed && <span className="text-sm font-medium">Menu</span>}
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {/* Nav items */}
                    <nav className="flex flex-col gap-1 p-2">
                        {siderItems.map(({ key, icon: Icon, label }) => {
                            const isActive = location.pathname.includes(key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => navigate(key)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full text-left",
                                        isActive
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {!collapsed && <span>{label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-50">
                    <div className="bg-white rounded-lg p-6 min-h-full shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white">
                Nhat Design ©{new Date().getFullYear()} Created by Nhat
            </footer>
        </div>
    );
};
