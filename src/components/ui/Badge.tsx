import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "slate" | "amber" | "emerald" | "red";
}

export function Badge({ className, variant = "slate", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200":
            variant === "brand",
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":
            variant === "slate",
          "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200":
            variant === "amber",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200":
            variant === "emerald",
          "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200":
            variant === "red",
        },
        className,
      )}
      {...props}
    />
  );
}
