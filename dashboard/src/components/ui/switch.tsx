import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.ComponentProps<"input">, "type">;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => (
    <input ref={ref} type="checkbox" role="switch" className={cn("h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-gray-200 p-0.5 transition-colors before:block before:h-4 before:w-4 before:rounded-full before:bg-white before:shadow-sm before:transition-transform checked:bg-gray-900 checked:before:translate-x-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));

Switch.displayName = "Switch";

export { Switch };
