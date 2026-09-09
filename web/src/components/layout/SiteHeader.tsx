import { ChevronDown, Menu, Search, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";
import { AccountMenu } from "@/components/layout/AccountMenu";

export function SiteHeader() {
  const navigate = useNavigate();
  const count = useCartStore((state) => state.itemCount());
  const toggle = useUiStore((state) => state.toggleMobileMenu);
  const toggleCart = useUiStore((state) => state.toggleCartDrawer);
  const cartOpen = useUiStore((state) => state.cartDrawerOpen);

  return (
    <header className="relative z-10 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-8">
        <button type="button" onClick={toggle} className="shrink-0 md:hidden" aria-label="Mở menu">
          <Menu size={23} />
        </button>
        <Link to="/" className="text-2xl font-black tracking-[-0.08em] sm:text-[32px]">SHOP.CO</Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/shop" className="flex items-center gap-1">Shop <ChevronDown size={14} /></Link>
          <Link to="/shop?sort=sale">On Sale</Link>
          <Link to="/shop?sort=new">New Arrivals</Link>
          <Link to="/shop?category=brands">Brands</Link>
        </nav>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("q");
            navigate(`/search?q=${String(value ?? "")}`);
          }}
          className="relative ml-auto hidden max-w-xl flex-1 lg:block"
        >
          <Search className="absolute left-4 top-3 text-black/40" size={20} />
          <input name="q" className="w-full rounded-full bg-[#f0f0f0] py-3 pl-12 pr-4 text-sm outline-none ring-black/10 focus:ring-2" placeholder="Search for products..." />
        </form>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <button type="button" onClick={() => navigate("/search")} className="lg:hidden" aria-label="Tìm kiếm"><Search size={22} /></button>
          <button type="button" onClick={toggleCart} className="relative flex size-11 items-center justify-center" aria-label="Mở giỏ hàng" aria-expanded={cartOpen}>
            <ShoppingCart size={23} />
            {count > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-black px-1 text-center text-[10px] leading-4 text-white">{count}</span>}
          </button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
