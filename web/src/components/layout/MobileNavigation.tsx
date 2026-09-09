import { Link } from "react-router-dom";
import { useUiStore } from "@/stores/uiStore";
export function MobileNavigation() { const open = useUiStore((state) => state.mobileMenuOpen); if (!open) return null; return <nav className="flex flex-col gap-3 border-b bg-white px-4 py-4 text-sm shadow-sm md:hidden"><Link to="/shop">Shop</Link><Link to="/shop?sort=new">New Arrivals</Link><Link to="/shop?sort=sale">On Sale</Link><Link to="/account">Account</Link></nav>; }
