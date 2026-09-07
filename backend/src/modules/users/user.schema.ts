import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "STAFF"]).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
  role: z.enum(["CUSTOMER", "ADMIN", "STAFF"]).optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
