import { create } from "zustand";
import type { User } from "@/types/auth";
import { authToken } from "@/lib/authToken";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  finishInitialization: () => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setSession: (user, token) => { authToken.set(token); set({ user, isAuthenticated: true, isInitialized: true }); },
  setUser: (user) => set({ user, isAuthenticated: true, isInitialized: true }),
  finishInitialization: () => set({ isInitialized: true }),
  clearSession: () => { authToken.clear(); set({ user: null, isAuthenticated: false, isInitialized: true }); },
}));
