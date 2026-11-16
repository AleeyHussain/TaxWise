import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-subtle bg-surface px-4 py-2.5 text-sm text-primary placeholder:text-secondary focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/20 transition min-h-[44px]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
