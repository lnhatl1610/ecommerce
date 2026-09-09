import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/users/types/user.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  isStaff: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => Boolean(get().accessToken && get().user),
      isStaff: () => {
        const role = get().user?.role;
        return role === "ADMIN" || role === "STAFF";
      },
    }),
    {
      name: "dashboard-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
);
