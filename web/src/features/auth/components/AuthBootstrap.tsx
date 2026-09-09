import { useEffect, type ReactNode } from "react";
import { authApi } from "@/features/auth/api/authApi";
import { authToken } from "@/lib/authToken";
import { useAuthStore } from "@/stores/authStore";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);
  const finishInitialization = useAuthStore((state) => state.finishInitialization);
  const clearSession = useAuthStore((state) => state.clearSession);
  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const { accessToken } = await authApi.refresh();
        authToken.set(accessToken);
        const user = await authApi.me();
        if (active && !useAuthStore.getState().isAuthenticated) setSession(user, accessToken);
      } catch { if (active) finishInitialization(); }
    };
    const handleExpired = () => clearSession();
    window.addEventListener("auth:expired", handleExpired);
    void restore();
    const refreshTimer = window.setInterval(() => {
      void authApi.refresh().then(({ accessToken }) => { if (active) authToken.set(accessToken); }).catch(() => { if (active && useAuthStore.getState().isAuthenticated) clearSession(); });
    }, 10 * 60 * 1000);
    return () => { active = false; window.clearInterval(refreshTimer); window.removeEventListener("auth:expired", handleExpired); };
  }, [clearSession, finishInitialization, setSession]);
  return children;
}
