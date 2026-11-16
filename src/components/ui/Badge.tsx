import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "slate" | "amber" | "emerald" | "red" | "ai";
}

export function Badge({ className, variant = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        {
          "bg-trust/10 text-trust border border-trust/20": variant === "brand",
          "bg-elevated text-secondary border border-subtle": variant === "slate",
          "bg-warning/10 text-warning border border-warning/20": variant === "amber",
          "bg-success/10 text-success border border-success/20": variant === "emerald",
          "bg-danger/10 text-danger border border-danger/20": variant === "red",
          "bg-ai/10 text-ai border border-ai/20": variant === "ai",
        },
        className,
      )}
      {...props}
    />
  );
}
