import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm outline-none transition placeholder:text-black/40 focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50", className)} {...props} />;
});
