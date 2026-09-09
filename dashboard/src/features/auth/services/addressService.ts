import type { Address } from "../types/address.types";
import api from "@/lib/api";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type CreateAddressPayload = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;
export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export const addressService = {
  getMyAddresses: async (): Promise<Address[]> => {
    const res = await api.get<ApiEnvelope<Address[]>>("/addresses");
    return res.data.data;
  },

  createAddress: async (payload: CreateAddressPayload): Promise<Address> => {
    const res = await api.post<ApiEnvelope<Address>>("/addresses", payload);
    return res.data.data;
  },

  updateAddress: async (id: string, payload: UpdateAddressPayload): Promise<Address> => {
    const res = await api.put<ApiEnvelope<Address>>(`/addresses/${id}`, payload);
    return res.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
