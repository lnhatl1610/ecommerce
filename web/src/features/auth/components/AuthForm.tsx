import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, registerSchema } from "@/lib/validators";

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type AuthValues = LoginValues & Partial<Pick<RegisterValues, "name" | "confirmPassword">>;

export function AuthForm({ registering, onSubmit }: { registering: boolean; onSubmit: (values: AuthValues) => Promise<void> }) {
  const schema = registering ? registerSchema : loginSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthValues>({ resolver: zodResolver(schema) });
  const field = (name: keyof AuthValues, label: string, type = "text") => <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span><Input {...register(name)} type={type} autoComplete={name === "email" ? "email" : name.includes("password") || name === "confirmPassword" ? "current-password" : "name"} aria-invalid={Boolean(errors[name])} /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors[name]?.message}</span></label>;
  return <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-2" noValidate>{registering && field("name", "Họ và tên")}{field("email", "Email", "email")}{field("password", "Mật khẩu", "password")}{registering && field("confirmPassword", "Xác nhận mật khẩu", "password")}<Button type="submit" disabled={isSubmitting} className="mt-2 w-full">{isSubmitting ? "Đang xử lý..." : registering ? "Đăng ký" : "Đăng nhập"}</Button></form>;
}
