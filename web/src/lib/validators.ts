import { z } from "zod";

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email("Email không hợp lệ"), password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự") });
export const registerSchema = loginSchema.extend({ name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"), confirmPassword: z.string() }).refine((value) => value.password === value.confirmPassword, { message: "Mật khẩu xác nhận không khớp", path: ["confirmPassword"] });
export const forgotPasswordSchema = z.object({ email: z.string().trim().toLowerCase().email("Email không hợp lệ") });
export const resetPasswordSchema = z.object({ password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"), confirmPassword: z.string() }).refine((value) => value.password === value.confirmPassword, { message: "Mật khẩu xác nhận không khớp", path: ["confirmPassword"] });
