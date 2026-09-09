import { Mail } from "lucide-react";

const footerGroups = [
  { title: "Company", links: ["About", "Features", "Works", "Career"] },
  { title: "Help", links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"] },
  { title: "FAQ", links: ["Account", "Manage Deliveries", "Orders", "Payments"] },
  { title: "Resources", links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"] },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[#f0f0f0] px-4 pb-6 sm:px-8">
      <div className="relative mx-auto -translate-y-10 max-w-7xl rounded-[20px] bg-black px-6 py-8 text-white sm:px-16 sm:py-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <h2 className="home-display max-w-xl text-[32px] leading-[.95] sm:text-[40px]">Stay up to date about our latest offers</h2>
          <form className="ml-auto w-full max-w-[350px] space-y-3" onSubmit={(event) => event.preventDefault()}>
            <label className="relative block">
              <Mail className="absolute left-4 top-3.5 text-black/40" size={18} />
              <span className="sr-only">Email address</span>
              <input required type="email" placeholder="Enter your email address" className="h-12 w-full rounded-full bg-white pl-12 pr-4 text-sm text-black outline-none" />
            </label>
            <button className="h-12 w-full rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-stone-200">Subscribe to Newsletter</button>
          </form>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-7 gap-y-9 pb-10 md:grid-cols-6">
        <div className="col-span-2 md:col-span-2">
          <strong className="text-[32px] font-black tracking-[-0.08em]">SHOP.CO</strong>
          <p className="mt-4 max-w-[270px] text-sm leading-5 text-black/60">We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
          <div className="mt-6 flex gap-3">
            {["𝕏", "f", "◎", "◉"].map((mark) => (
              <a key={mark} href="#" aria-label="Social media" className="flex size-7 items-center justify-center rounded-full border border-black/20 bg-white text-xs font-bold transition hover:bg-black hover:text-white">{mark}</a>
            ))}
          </div>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-medium uppercase tracking-[.2em]">{group.title}</h2>
            <ul className="mt-5 space-y-3 text-sm text-black/60">
              {group.links.map((link) => <li key={link}><a href="#" className="hover:text-black">{link}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-black/10 pt-5 text-xs text-black/50 sm:flex-row">
        <p>Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex gap-2" aria-label="Accepted payment methods">
          {["VISA", "●●", "PayPal", "Pay", "G Pay"].map((method) => <span key={method} className="rounded border border-black/10 bg-white px-2 py-1 font-semibold text-black/70">{method}</span>)}
        </div>
      </div>
    </footer>
  );
}
