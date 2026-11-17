import * as React from "react";

export interface IllustrationProps {
  className?: string;
}

export default function EmptyStateIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background subtle glow */}
      <circle
        cx="100"
        cy="105"
        r="75"
        fill="var(--accent-primary-glow, var(--accent-primary))"
        opacity="0.08"
      />

      {/* Bot Companion (inquiry pose) */}
      <g transform="translate(10, 10)">
        {/* Antenna */}
        <line
          x1="65"
          y1="60"
          x2="65"
          y2="42"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="65" cy="38" r="5" fill="var(--accent-ai)" />

        {/* Head Shell */}
        <rect
          x="30"
          y="60"
          width="70"
          height="58"
          rx="18"
          fill="var(--bg-surface)"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
        />

        {/* Screen / Visor */}
        <rect
          x="38"
          y="68"
          width="54"
          height="42"
          rx="12"
          fill="var(--bg-base)"
        />

        {/* Cheeks */}
        <circle cx="46" cy="96" r="4" fill="var(--accent-primary)" opacity="0.15" />
        <circle cx="84" cy="96" r="4" fill="var(--accent-primary)" opacity="0.15" />

        {/* Curious Eyes looking toward question mark */}
        <circle cx="58" cy="85" r="4" fill="var(--text-primary)" />
        <circle cx="76" cy="85" r="4" fill="var(--text-primary)" />

        {/* Inquisitive Smile */}
        <path
          d="M 59 95 Q 66 100 73 95"
          stroke="var(--text-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Question Mark Bubble */}
      <g transform="translate(10, 10)">
        <circle
          cx="135"
          cy="75"
          r="26"
          fill="var(--bg-elevated)"
          stroke="var(--border-default)"
          strokeWidth="2"
        />
        {/* Question mark glyph */}
        <path
          d="M 129 68 C 129 63 132 59 137 59 C 142 59 145 63 145 67 C 145 72 140 75 137 78 L 137 81"
          stroke="var(--accent-ai)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="137" cy="88" r="2.5" fill="var(--accent-ai)" />
      </g>

      {/* Little floating stars */}
      <path
        d="M 170 35 Q 170 42 163 42 Q 170 42 170 49 Q 170 42 177 42 Q 170 42 170 35 Z"
        fill="var(--accent-ai)"
        opacity="0.8"
      />
      <circle cx="35" cy="145" r="3" fill="var(--accent-cta)" opacity="0.5" />
    </svg>
  );
}
