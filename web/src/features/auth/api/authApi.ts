import type { ApiEnvelope } from "@/types/api";
import type { AuthResult, User } from "@/types/auth";
import { apiClient } from "@/lib/apiClient";

export const authApi = {
  login: async (email: string, password: string) => (await apiClient.post<ApiEnvelope<AuthResult>>("/auth/login", { email, password })).data.data,
  register: async (name: string, email: string, password: string) => (await apiClient.post<ApiEnvelope<AuthResult>>("/auth/register", { name, email, password })).data.data,
  refresh: async () => (await apiClient.post<ApiEnvelope<{ accessToken: string }>>("/auth/refresh")).data.data,
  me: async () => (await apiClient.get<ApiEnvelope<User>>("/users/me")).data.data,
  updateMe: async (payload: { name: string; phone?: string; logoUrl?: string; gender?: User["gender"]; dateOfBirth?: string }) => (await apiClient.put<ApiEnvelope<User>>("/users/me", payload)).data.data,
  forgotPassword: async (email: string) => (await apiClient.post<ApiEnvelope<null>>("/auth/forgot-password", { email })).data,
  resetPassword: async (token: string, password: string) => (await apiClient.post<ApiEnvelope<null>>("/auth/reset-password", { token, password })).data,
  changePassword: async (currentPassword: string, newPassword: string) => (await apiClient.post<ApiEnvelope<null>>("/auth/change-password", { currentPassword, newPassword })).data,
  logout: () => apiClient.post("/auth/logout"),
};
