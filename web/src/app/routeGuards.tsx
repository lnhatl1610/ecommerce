import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "@/components/ui/Spinner";

export function ProtectedRoute() {
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const initialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();
  if (!initialized) return <div className="flex min-h-[50vh] items-center justify-center"><Spinner /></div>;
  return authenticated ? <Outlet/> : <Navigate replace state={{ from: location }} to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} />;
}
