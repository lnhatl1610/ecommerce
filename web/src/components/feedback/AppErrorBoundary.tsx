import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface State { hasError: boolean }

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(): State { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Storefront render error", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="flex min-h-screen items-center justify-center p-6"><section className="max-w-md text-center"><h1 className="text-3xl font-black">Có lỗi xảy ra</h1><p className="mt-3 text-black/60">Trang không thể hiển thị. Bạn có thể tải lại để thử lại.</p><Button className="mt-6" onClick={() => window.location.reload()}>Tải lại trang</Button></section></main>;
  }
}
