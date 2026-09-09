import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/features/auth/api/authApi";
import { forgotPasswordSchema } from "@/lib/validators";

type Values = z.infer<typeof forgotPasswordSchema>;
export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(forgotPasswordSchema) });
  return <><h1 className="mt-8 text-3xl font-black">Quên mật khẩu</h1><p className="mt-3 text-sm text-black/60">Nhập email để nhận đường dẫn khôi phục có hiệu lực trong 30 phút.</p><form className="mt-6" onSubmit={handleSubmit(async ({ email }) => { await authApi.forgotPassword(email); toast.success("Nếu tài khoản tồn tại, email khôi phục đã được gửi."); })}><label><span className="mb-1.5 block text-sm font-medium">Email</span><Input {...register("email")} type="email" /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors.email?.message}</span></label><Button type="submit" disabled={isSubmitting} className="mt-3 w-full">{isSubmitting ? "Đang gửi..." : "Gửi email"}</Button></form></>;
}
