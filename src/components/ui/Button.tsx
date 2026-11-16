import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cta" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold min-h-[44px] min-w-[44px] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
          {
            "bg-trust text-white hover:brightness-110 focus-visible:ring-trust":
              variant === "primary",
            "border border-subtle bg-surface text-primary hover:bg-elevated hover:border-trust/40 focus-visible:ring-trust":
              variant === "secondary",
            "text-secondary hover:text-primary hover:bg-elevated focus-visible:ring-trust":
              variant === "ghost",
            "bg-cta text-white hover:brightness-110 hover:shadow-lg focus-visible:ring-cta":
              variant === "cta",
            "bg-danger text-white hover:brightness-110 focus-visible:ring-danger":
              variant === "danger",
            "px-3.5 py-1.5 text-xs min-h-[36px]": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3.5 text-base": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
