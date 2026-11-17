import * as React from "react";

export interface IllustrationProps {
  className?: string;
}

export default function NotFoundIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background ambient orbit */}
      <circle
        cx="150"
        cy="150"
        r="110"
        fill="var(--accent-primary-glow, var(--accent-primary))"
        opacity="0.08"
      />

      {/* Looping flight path / wind trail */}
      <path
        d="M 50 230 C 120 230 170 250 150 180 C 130 110 210 110 220 145"
        stroke="var(--accent-cta)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="6 6"
        fill="none"
        opacity="0.8"
      />

      {/* Floating Paper Airplane (off-course) */}
      <g transform="translate(195, 115) rotate(24)">
        {/* Main top wing */}
        <polygon
          points="40,0 -20,-16 -6,0"
          fill="var(--accent-primary)"
        />
        {/* Bottom wing (folded perspective) */}
        <polygon
          points="40,0 -6,0 -20,16"
          fill="var(--accent-ai)"
        />
        {/* Center crease line */}
        <line
          x1="-6"
          y1="0"
          x2="40"
          y2="0"
          stroke="var(--bg-base)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Lost Tax Document / Envelope */}
      <g transform="translate(55, 75) rotate(-12)">
        {/* Document shadow */}
        <rect
          x="4"
          y="4"
          width="80"
          height="56"
          rx="10"
          fill="var(--shadow-color)"
          opacity="0.2"
        />
        {/* Document base */}
        <rect
          x="0"
          y="0"
          width="80"
          height="56"
          rx="10"
          fill="var(--bg-surface)"
          stroke="var(--border-default)"
          strokeWidth="2.5"
        />
        {/* Envelope fold flap */}
        <path
          d="M 0 0 L 40 28 L 80 0"
          stroke="var(--accent-primary)"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        {/* 404 Stamp Badge */}
        <rect
          x="52"
          y="28"
          width="20"
          height="18"
          rx="4"
          fill="var(--accent-primary)"
          opacity="0.15"
          stroke="var(--accent-primary)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx="62" cy="37" r="3" fill="var(--accent-cta)" />
      </g>

      {/* Floating Sparkles & Dust motes */}
      <path
        d="M 245 60 Q 245 70 235 70 Q 245 70 245 80 Q 245 70 255 70 Q 245 70 245 60 Z"
        fill="var(--accent-ai)"
        opacity="0.9"
      />
      <circle cx="70" cy="180" r="4" fill="var(--accent-primary)" opacity="0.3" />
      <circle cx="130" cy="50" r="3" fill="var(--accent-cta)" opacity="0.4" />
      <circle cx="250" cy="220" r="5" fill="var(--accent-ai)" opacity="0.2" />
    </svg>
  );
}
