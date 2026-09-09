import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;

export function DropdownMenuContent({ className, align = "end", sideOffset = 8, ...props }: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "sideOffset">) {
  return <MenuPrimitive.Portal><MenuPrimitive.Positioner align={align} sideOffset={sideOffset} className="z-50 outline-none"><MenuPrimitive.Popup className={cn("w-64 origin-[var(--transform-origin)] rounded-2xl border border-black/10 bg-white p-2 text-black shadow-xl outline-none transition data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100", className)} {...props} /></MenuPrimitive.Positioner></MenuPrimitive.Portal>;
}

export function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm outline-none transition hover:bg-black/5 focus:bg-black/5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0", className)} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-3 py-2 text-xs text-black/50", className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className={cn("my-1 h-px bg-black/10", className)} {...props} />;
}
