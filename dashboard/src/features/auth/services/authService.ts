import api from "@/lib/api";
import type { User } from "@/features/users/types/user.types";

export interface AuthResult {
  user: User;
  accessToken: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  register: async (name: string, email: string, password: string, phone?: string): Promise<AuthResult> => {
    const res = await api.post<ApiEnvelope<AuthResult>>("/auth/register", { name, email, password, phone });
    return res.data.data;
  },
  login: async (email: string, password: string): Promise<AuthResult> => {
    const res = await api.post<ApiEnvelope<AuthResult>>("/auth/login", { email, password });
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const res = await api.post<ApiEnvelope<{ accessToken: string }>>("/auth/refresh");
    return res.data.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post("/auth/reset-password", { token, password });
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiEnvelope<User>>("/users/me");
    return res.data.data;
  },

  updateMe: async (payload: Partial<Pick<User, "name" | "phone" | "avatar">> & { password?: string }): Promise<User> => {
    const res = await api.put<ApiEnvelope<User>>("/users/me", payload);
    return res.data.data;
  },
};
