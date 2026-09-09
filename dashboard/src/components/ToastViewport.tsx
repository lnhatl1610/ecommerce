import { useEffect, useState } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

type ToastDetail = { id: number; message: string; type?: "success" | "info" };
const toastEvent = "dashboard:toast";

export function ToastViewport() {
  const [toast, setToast] = useState<ToastDetail | null>(null);
  useEffect(() => { const onToast = (event: Event) => setToast((event as CustomEvent<ToastDetail>).detail); window.addEventListener(toastEvent, onToast); return () => window.removeEventListener(toastEvent, onToast); }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 3200); return () => window.clearTimeout(timer); }, [toast]);
  if (!toast) return null;
  return <div className="fixed right-4 top-20 z-50 flex max-w-sm items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-xl" role="status"><span className="text-emerald-300" aria-hidden="true">{toast.type === "info" ? <Info size={18} /> : <CheckCircle2 size={18} />}</span><span>{toast.message}</span><button type="button" onClick={() => setToast(null)} aria-label="Đóng thông báo" className="ml-2 rounded p-1 hover:bg-white/10"><X size={16} /></button></div>;
}
