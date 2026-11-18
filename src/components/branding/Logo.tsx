import * as React from "react";
import { cn } from "@/lib/cn";

export type LogoVariant = "full" | "icon-only" | "monochrome";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  variant?: LogoVariant;
  showTagline?: boolean;
}

export function LogoMark({
  size = 32,
  variant = "full",
  className,
}: {
  size?: number;
  variant?: LogoVariant;
  className?: string;
}) {
  const isMonochrome = variant === "monochrome";
  const squircle = "M 34 4 L 94 4 C 114 4 124 14 124 34 L 124 94 C 124 114 114 124 94 124 L 34 124 C 14 124 4 114 4 94 L 4 34 C 4 14 14 4 34 4 Z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tw-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--accent-primary, #1E3A8A)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-cta, #0284C7)" }} />
        </linearGradient>
        {isMonochrome && (
          <mask id="tw-mark-mask">
            <rect width="128" height="128" fill="#FFFFFF" />
            <g
              fill="none"
              stroke="#000000"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 40 42 L 40 86" />
              <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
            </g>
          </mask>
        )}
      </defs>

      {/* Squircle Badge Container */}
      <path
        d={squircle}
        fill={isMonochrome ? "currentColor" : "url(#tw-brand-grad)"}
        mask={isMonochrome ? "url(#tw-mark-mask)" : undefined}
      />

      {/* Hand-crafted Monogram Merge (T + W) */}
      {!isMonochrome && (
        <g
          fill="none"
          stroke="var(--bg-base, #FFFFFF)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 40 42 L 40 86" />
          <path d="M 22 42 L 58 42 L 70 86 L 82 58 L 94 86 L 106 42" />
        </g>
      )}
    </svg>
  );
}

export function Logo({
  size = 32,
  variant = "full",
  showTagline = false,
  className,
  ...props
}: LogoProps) {
  // Font scale proportional to badge size
  const fontSizeClass =
    size >= 64
      ? "text-3xl tracking-tight"
      : size >= 48
      ? "text-2xl tracking-tight"
      : size >= 36
      ? "text-xl tracking-tight"
      : "text-lg tracking-tight";

  if (variant === "icon-only") {
    return (
      <span
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <LogoMark size={size} variant={variant} />
        <span className="sr-only">TaxWise</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-bold select-none",
        className,
      )}
      {...props}
    >
      <LogoMark size={size} variant={variant} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold text-primary font-display",
            fontSizeClass,
          )}
        >
          Tax<span className="text-accent">Wise</span>
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[11px] font-medium text-secondary">
            The tax plan that fits you
          </span>
        )}
      </span>
    </span>
  );
}

export default Logo;
