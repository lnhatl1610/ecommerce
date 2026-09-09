import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "default", type = "button", ...props }, ref) {
  const variants = { default: "bg-black text-white hover:bg-black/80", outline: "border border-black/15 bg-white hover:bg-black/5", ghost: "hover:bg-black/5", destructive: "bg-red-600 text-white hover:bg-red-700" };
  return <button ref={ref} type={type} className={cn("inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2", variants[variant], className)} {...props} />;
});
