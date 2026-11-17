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
          <stop offset="0%" style={{ stopColor: "var(--accent-primary, #2563EB)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent-cta, #06B6D4)" }} />
        </linearGradient>
        {isMonochrome && (
          <mask id="tw-mark-mask">
            <rect width="128" height="128" fill="#FFFFFF" />
            <g
              fill="none"
              stroke="#000000"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 24 44 L 56 44" />
              <path d="M 40 44 L 40 86" />
              <path d="M 64 44 L 73 86 L 84 55 L 95 88 L 105 38" />
            </g>
            <path
              d="M 106 14 Q 106 20 100 20 Q 106 20 106 26 Q 106 20 112 20 Q 106 20 106 14 Z"
              fill="#000000"
            />
          </mask>
        )}
      </defs>

      {/* Badge container */}
      <rect
        x="4"
        y="4"
        width="120"
        height="120"
        rx="24"
        fill={isMonochrome ? "currentColor" : "url(#tw-brand-grad)"}
        mask={isMonochrome ? "url(#tw-mark-mask)" : undefined}
      />

      {/* Letters TW - visible in standard/full variant */}
      {!isMonochrome && (
        <>
          <g
            fill="none"
            stroke="var(--bg-base, #FFFFFF)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 24 44 L 56 44" />
            <path d="M 40 44 L 40 86" />
            <path d="M 64 44 L 73 86 L 84 55 L 95 88 L 105 38" />
          </g>
          <path
            d="M 106 14 Q 106 20 100 20 Q 106 20 106 26 Q 106 20 112 20 Q 106 20 106 14 Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </>
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
