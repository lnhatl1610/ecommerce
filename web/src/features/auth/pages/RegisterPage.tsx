import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/stores/authStore";
import { getApiErrorMessage } from "@/lib/apiError";

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  return <><h1 className="mt-8 text-3xl font-black">Tạo tài khoản</h1><p className="mt-2 text-sm text-black/60">Đăng ký để lưu giỏ hàng và theo dõi đơn.</p><AuthForm registering onSubmit={async (values) => { try { const result = await authApi.register(values.name ?? "", values.email, values.password); setSession(result.user, result.accessToken); toast.success("Đăng ký thành công."); navigate("/"); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Không thể đăng ký.")); } }}/><p className="mt-4 text-center text-sm">Đã có tài khoản? <Link className="underline" to="/login">Đăng nhập</Link></p></>;
}
