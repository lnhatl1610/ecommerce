import { Outlet, Link } from "react-router-dom";
export function AuthLayout() { return <main className="flex min-h-screen items-center justify-center bg-stone-100 p-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm"><Link to="/" className="text-2xl font-black tracking-[-0.08em]">SHOP.CO</Link><Outlet/></section></main>; }
