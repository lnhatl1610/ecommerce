import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { AppErrorBoundary } from "@/components/feedback/AppErrorBoundary";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } });

export function AppProviders({ children }: { children: ReactNode }) {
  return <AppErrorBoundary><HelmetProvider><QueryClientProvider client={queryClient}><AuthBootstrap>{children}</AuthBootstrap><Toaster richColors position="top-right" /></QueryClientProvider></HelmetProvider></AppErrorBoundary>;
}
