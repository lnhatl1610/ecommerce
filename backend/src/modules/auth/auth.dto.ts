import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({ email: z.string().trim().toLowerCase().email("Invalid email format") });
export const resetPasswordSchema = z.object({ token: z.string().min(32), password: z.string().min(8, "Password must be at least 8 characters") });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8, "Password must be at least 8 characters") });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
