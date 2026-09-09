import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getApiErrorMessage } from "@/lib/apiError";

const schema = z.object({ currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"), newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"), confirmPassword: z.string().min(1, "Nhập lại mật khẩu mới") }).refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"], message: "Mật khẩu xác nhận không khớp" });
type Values = z.infer<typeof schema>;

export function ChangePasswordPage() { const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Values>({ resolver: zodResolver(schema) }); return <div><h1 className="text-3xl font-black sm:text-4xl">Đổi mật khẩu</h1><p className="mt-2 text-sm text-black/60">Dùng mật khẩu mạnh và không chia sẻ với người khác.</p><form className="mt-6 max-w-xl space-y-4 rounded-2xl border border-black/10 bg-white p-5 sm:p-6" onSubmit={handleSubmit(async (values) => { try { await authApi.changePassword(values.currentPassword, values.newPassword); reset(); toast.success("Đã đổi mật khẩu."); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Không thể đổi mật khẩu.")); } })}>{(["currentPassword", "newPassword", "confirmPassword"] as const).map((name) => <label key={name}><span className="mb-1.5 block text-sm font-medium">{name === "currentPassword" ? "Mật khẩu hiện tại" : name === "newPassword" ? "Mật khẩu mới" : "Xác nhận mật khẩu mới"}</span><Input {...register(name)} type="password" autoComplete="new-password" /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors[name]?.message}</span></label>)}<Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</Button></form></div>; }
