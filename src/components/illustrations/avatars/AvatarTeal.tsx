import * as React from "react";

export interface AvatarProps {
  size?: number;
  className?: string;
}

export default function AvatarTeal({ size = 48, className }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Teal background circle */}
      <circle cx="24" cy="24" r="24" fill="var(--accent-ai)" />

      {/* Human hair styling (minimalist geometric bangs) */}
      <path
        d="M 12 18 C 14 10 34 10 36 18 C 32 14 26 15 24 18 C 22 15 16 14 12 18 Z"
        fill="var(--bg-base)"
      />

      {/* Round designer glasses */}
      <circle cx="18" cy="23" r="4.5" stroke="var(--bg-base)" strokeWidth="1.8" fill="none" />
      <circle cx="30" cy="23" r="4.5" stroke="var(--bg-base)" strokeWidth="1.8" fill="none" />
      <line x1="22.5" y1="23" x2="25.5" y2="23" stroke="var(--bg-base)" strokeWidth="1.5" />

      {/* Human Eyes behind lenses */}
      <circle cx="18" cy="23" r="1.8" fill="var(--bg-base)" />
      <circle cx="30" cy="23" r="1.8" fill="var(--bg-base)" />

      {/* Warm Smile */}
      <path
        d="M 20 31 Q 24 35 28 31"
        stroke="var(--bg-base)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
