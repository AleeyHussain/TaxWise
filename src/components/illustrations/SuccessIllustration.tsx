import * as React from "react";

export interface IllustrationProps {
  className?: string;
}

export default function SuccessIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 250 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer celebratory burst/star polygon */}
      <g transform="translate(125, 125)">
        {/* Soft 12-point burst aura */}
        <path
          d="
            M 0 -85 L 22 -62 L 54 -74 L 62 -42 L 85 -22 L 74 10 L 85 42 L 58 54 L 42 85 L 10 74 L -22 85 L -42 58 L -74 62 L -62 30 L -85 0 L -62 -30 L -74 -62 L -42 -58 L -22 -85 Z
          "
          fill="var(--accent-success)"
          opacity="0.12"
        />

        {/* Ambient Ring */}
        <circle
          cx="0"
          cy="0"
          r="66"
          stroke="var(--accent-success)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.4"
        />

        {/* Main Badge Container */}
        <circle
          cx="0"
          cy="0"
          r="52"
          fill="var(--bg-surface)"
          stroke="var(--accent-success)"
          strokeWidth="3.5"
        />

        {/* Celebratory Checkmark */}
        <path
          d="M -20 0 L -5 15 L 22 -12"
          stroke="var(--accent-success)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Floating Sparkles & Confetti */}
        <path
          d="M 65 -55 Q 65 -45 55 -45 Q 65 -45 65 -35 Q 65 -45 75 -45 Q 65 -45 65 -55 Z"
          fill="var(--accent-ai)"
        />
        <path
          d="M -65 45 Q -65 53 -73 53 Q -65 53 -65 61 Q -65 53 -57 53 Q -65 53 -65 45 Z"
          fill="var(--accent-cta)"
        />
        <circle cx="-55" cy="-55" r="4" fill="var(--accent-primary)" opacity="0.6" />
        <circle cx="70" cy="40" r="3.5" fill="var(--accent-premium)" opacity="0.6" />
        <circle cx="0" cy="-76" r="3" fill="var(--accent-success)" opacity="0.5" />
      </g>
    </svg>
  );
}
