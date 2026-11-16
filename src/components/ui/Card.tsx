import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-subtle bg-surface shadow-sm transition-all duration-200",
        hover && "hover:-translate-y-1 hover:shadow-xl hover:border-trust/40",
        className,
      )}
      {...props}
    />
  );
}
