import * as React from "react";

export interface AvatarProps {
  size?: number;
  className?: string;
}

export default function AvatarPurple({ size = 48, className }: AvatarProps) {
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
      {/* Purple background circle */}
      <circle cx="24" cy="24" r="24" fill="var(--accent-premium)" />

      {/* Human hair styling (curved side locks) */}
      <path
        d="M 12 25 C 10 14 38 14 36 25 C 33 16 31 15 24 15 C 17 15 15 16 12 25 Z"
        fill="var(--bg-base)"
      />

      {/* Confident Eyes */}
      <circle cx="18" cy="23" r="2.2" fill="var(--bg-base)" />
      <circle cx="30" cy="23" r="2.2" fill="var(--bg-base)" />

      {/* Small dot earrings */}
      <circle cx="11" cy="27" r="1.5" fill="var(--bg-base)" />
      <circle cx="37" cy="27" r="1.5" fill="var(--bg-base)" />

      {/* Sincere warm smile */}
      <path
        d="M 20 30 Q 24 34 28 30"
        stroke="var(--bg-base)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
