import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/features/auth/api/authApi";
import { resetPasswordSchema } from "@/lib/validators";
import { getApiErrorMessage } from "@/lib/apiError";

type Values = z.infer<typeof resetPasswordSchema>;
export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(resetPasswordSchema) });
  const token = params.get("token") ?? "";
  return <><h1 className="mt-8 text-3xl font-black">Đặt lại mật khẩu</h1>{!token ? <p className="mt-4 text-sm text-red-600">Đường dẫn khôi phục không hợp lệ.</p> : <form className="mt-6 space-y-2" onSubmit={handleSubmit(async ({ password }) => { try { await authApi.resetPassword(token, password); toast.success("Mật khẩu đã được cập nhật."); navigate("/login"); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Không thể đặt lại mật khẩu.")); } })}><label><span className="mb-1.5 block text-sm font-medium">Mật khẩu mới</span><Input {...register("password")} type="password" /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors.password?.message}</span></label><label><span className="mb-1.5 block text-sm font-medium">Xác nhận mật khẩu</span><Input {...register("confirmPassword")} type="password" /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors.confirmPassword?.message}</span></label><Button type="submit" disabled={isSubmitting} className="mt-3 w-full">{isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</Button></form>}</>;
}
