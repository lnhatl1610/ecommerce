import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { cartApi } from "@/features/cart/api/cartApi";
import { useCartStore } from "@/stores/cartStore";
import { getApiErrorMessage } from "@/lib/apiError";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const setCart = useCartStore((state) => state.setCart);
  return <><h1 className="mt-8 text-3xl font-black">Đăng nhập</h1><p className="mt-2 text-sm text-black/60">Chào mừng bạn quay lại SHOP.CO.</p><AuthForm registering={false} onSubmit={async (values) => { try { const result = await authApi.login(values.email, values.password); setSession(result.user, result.accessToken); try { await cartApi.merge(); setCart(await cartApi.get()); } catch { toast.warning("Đăng nhập thành công nhưng chưa thể đồng bộ giỏ hàng."); } const fromState = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from; const redirect = params.get("redirect"); navigate(redirect ?? (fromState ? `${fromState.pathname}${fromState.search ?? ""}` : "/"), { replace: true }); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Email hoặc mật khẩu không đúng.")); } }}/><div className="mt-4 flex justify-between text-sm"><Link className="underline" to="/forgot-password">Quên mật khẩu?</Link><Link className="underline" to="/register">Đăng ký</Link></div></>;
}
