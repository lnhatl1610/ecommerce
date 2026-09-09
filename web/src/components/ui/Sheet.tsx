import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

export function SheetContent({ className, children, ...props }: SheetPrimitive.Popup.Props) {
  return <SheetPrimitive.Portal><SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" /><SheetPrimitive.Popup className={cn("fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full", className)} {...props}>{children}<SheetPrimitive.Close aria-label="Đóng" className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full hover:bg-black/5"><X /></SheetPrimitive.Close></SheetPrimitive.Popup></SheetPrimitive.Portal>;
}

export function SheetHeader({ className, ...props }: React.ComponentProps<"header">) { return <header className={cn("border-b px-5 py-6", className)} {...props} />; }
export function SheetFooter({ className, ...props }: React.ComponentProps<"footer">) { return <footer className={cn("mt-auto border-t p-5", className)} {...props} />; }
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;
