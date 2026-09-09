import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "STAFF"]).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "STAFF"]).optional(),
  isActive: z.boolean().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
  emailVerifiedAt: z.coerce.date().nullable().optional(),
  phoneVerifiedAt: z.coerce.date().nullable().optional(),
  provider: z.enum(["LOCAL", "GOOGLE", "FACEBOOK"]).optional(),
  providerId: z.string().max(255).nullable().optional(),
});

export const updateMeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.coerce.date().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateMeInput = z.infer<typeof updateMeSchema>;
