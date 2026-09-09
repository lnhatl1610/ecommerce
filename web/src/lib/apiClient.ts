import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";
import { authToken } from "./authToken";
import type { ApiEnvelope } from "@/types/api";

interface RetryableRequest extends InternalAxiosRequestConfig { _retry?: boolean }
let refreshRequest: Promise<string> | null = null;

export const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 10_000, withCredentials: true, headers: { "X-Client-App": "storefront" } });

apiClient.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const url = request?.url ?? "";
    const isAuthCall = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"].some((path) => url.includes(path));
    if (error.response?.status !== 401 || !request || request._retry || isAuthCall) return Promise.reject(error);
    request._retry = true;
    refreshRequest ??= axios.post<ApiEnvelope<{ accessToken: string }>>(`${API_BASE_URL}/auth/refresh`, undefined, { withCredentials: true }).then((response) => {
      const token = response.data.data.accessToken;
      authToken.set(token);
      return token;
    }).finally(() => { refreshRequest = null; });
    try {
      const token = await refreshRequest;
      request.headers.Authorization = `Bearer ${token}`;
      return apiClient(request);
    } catch (refreshError: unknown) {
      authToken.clear();
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(refreshError);
    }
  },
);
