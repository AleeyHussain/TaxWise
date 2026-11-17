import * as React from "react";

export interface AvatarProps {
  size?: number;
  className?: string;
}

export default function AvatarAmber({ size = 48, className }: AvatarProps) {
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
      {/* Amber/warm background circle */}
      <circle cx="24" cy="24" r="24" fill="var(--accent-cta)" />

      {/* Human hair styling (side swept) */}
      <path
        d="M 12 20 C 13 11 35 11 36 21 C 32 15 22 13 12 20 Z"
        fill="var(--bg-base)"
      />

      {/* Eyebrows */}
      <path d="M 16 19 Q 19 17 21 19" stroke="var(--bg-base)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 27 19 Q 29 17 32 19" stroke="var(--bg-base)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Friendly Eyes */}
      <circle cx="18" cy="23" r="2.2" fill="var(--bg-base)" />
      <circle cx="30" cy="23" r="2.2" fill="var(--bg-base)" />

      {/* Enthusiastic Smile */}
      <path
        d="M 19 29 Q 24 35 29 29"
        stroke="var(--bg-base)"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
