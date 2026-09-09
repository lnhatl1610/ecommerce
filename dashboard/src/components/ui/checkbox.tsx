import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
    indeterminate?: boolean;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, indeterminate = false, ...props }, ref) => {
        const inputRef = React.useRef<HTMLInputElement | null>(null);

        React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

        React.useEffect(() => {
            if (inputRef.current) inputRef.current.indeterminate = indeterminate;
        }, [indeterminate]);

        return <input ref={inputRef} type="checkbox" className={cn("h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-gray-900 accent-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
    },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
