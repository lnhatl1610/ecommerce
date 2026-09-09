import { z } from "zod";

export const createAddressSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  phone: z.string().min(8, "Phone is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().min(1, "Ward is required"),
  detail: z.string().min(1, "Address detail is required"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  recipientName: z.string().min(1).optional(),
  phone: z.string().min(8).optional(),
  province: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  ward: z.string().min(1).optional(),
  detail: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
