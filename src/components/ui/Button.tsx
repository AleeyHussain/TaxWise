import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export type Variant = "primary" | "secondary" | "ghost" | "cta";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:pointer-events-none",
          {
            // primary  = accent-primary background, white text
            "bg-accent text-white hover:bg-accent-hover shadow-xs":
              variant === "primary",
            // secondary = surface background with border, primary text
            "bg-surface border border-border text-primary hover:bg-elevated":
              variant === "secondary",
            // ghost   = transparent, primary text on hover-bg
            "bg-transparent text-secondary hover:text-primary hover:bg-elevated":
              variant === "ghost",
            // cta     = accent-cta background, white text — RESERVED for the hero and final-CTA button ONLY. Maximum two instances per page.
            "bg-accent-cta text-white font-semibold hover:bg-accent-cta-hover shadow-md":
              variant === "cta",

            // Sizes
            "h-9 px-4 text-sm gap-2 rounded-lg": size === "sm",
            "h-11 px-5 text-sm gap-2 rounded-xl": size === "md",
            "h-[52px] px-6 text-base gap-2.5 rounded-xl": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
export default Button;
