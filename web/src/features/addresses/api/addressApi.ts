import { apiClient } from "@/lib/apiClient";
import type { ApiEnvelope } from "@/types/api";
import type { Address, AddressPayload } from "@/types/address";

export const addressApi = {
  list: async () => (await apiClient.get<ApiEnvelope<Address[]>>("/addresses")).data.data,
  create: async (payload: AddressPayload) => (await apiClient.post<ApiEnvelope<Address>>("/addresses", payload)).data.data,
  update: async (id: string, payload: Partial<AddressPayload>) => (await apiClient.put<ApiEnvelope<Address>>(`/addresses/${id}`, payload)).data.data,
  remove: async (id: string) => { await apiClient.delete(`/addresses/${id}`); },
  setDefault: async (id: string) => (await apiClient.put<ApiEnvelope<Address>>(`/addresses/${id}/default`)).data.data,
};
