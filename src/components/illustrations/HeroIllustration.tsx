import * as React from "react";

export interface IllustrationProps {
  className?: string;
}

export default function HeroIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background ambient glow circle */}
      <circle
        cx="200"
        cy="250"
        r="140"
        fill="var(--accent-primary-glow, var(--accent-primary))"
        opacity="0.12"
      />

      {/* Floating Sparkle Star Above */}
      <g opacity="0.9">
        <path
          d="M 230 40 Q 230 55 215 55 Q 230 55 230 70 Q 230 55 245 55 Q 230 55 230 40 Z"
          fill="var(--accent-ai)"
        />
        <circle cx="270" cy="85" r="4" fill="var(--accent-cta)" opacity="0.6" />
        <circle cx="120" cy="45" r="3" fill="var(--accent-ai)" opacity="0.4" />
      </g>

      {/* 1. Tax Form Sheet (Input / Chaos) */}
      <g transform="translate(35, 70)">
        {/* Form shadow backing */}
        <rect
          x="4"
          y="6"
          width="160"
          height="220"
          rx="18"
          fill="var(--shadow-color)"
          opacity="0.2"
        />
        {/* Main form page */}
        <rect
          x="0"
          y="0"
          width="160"
          height="220"
          rx="18"
          fill="var(--bg-surface)"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
        />
        {/* Form header pill */}
        <rect
          x="20"
          y="24"
          width="80"
          height="12"
          rx="6"
          fill="var(--accent-primary)"
          opacity="0.35"
        />
        <rect
          x="110"
          y="24"
          width="30"
          height="12"
          rx="6"
          fill="var(--border-subtle)"
        />

        {/* Abstract form fields / schedule lines */}
        <rect x="20" y="54" width="120" height="8" rx="4" fill="var(--border-subtle)" />
        <rect x="20" y="72" width="95" height="8" rx="4" fill="var(--border-subtle)" />
        <rect x="20" y="90" width="110" height="8" rx="4" fill="var(--border-subtle)" />

        {/* Form check items */}
        <rect x="20" y="116" width="14" height="14" rx="4" fill="var(--accent-primary)" opacity="0.25" />
        <rect x="42" y="119" width="70" height="8" rx="4" fill="var(--border-subtle)" />

        <rect x="20" y="140" width="14" height="14" rx="4" fill="var(--accent-primary)" opacity="0.25" />
        <rect x="42" y="143" width="85" height="8" rx="4" fill="var(--border-subtle)" />

        <rect x="20" y="164" width="14" height="14" rx="4" fill="var(--accent-primary)" opacity="0.25" />
        <rect x="42" y="167" width="55" height="8" rx="4" fill="var(--border-subtle)" />

        {/* Form stamp */}
        <circle cx="125" cy="180" r="16" fill="var(--accent-primary)" opacity="0.1" />
      </g>

      {/* 2. Transformation Flow Arrow with Particles */}
      <g>
        <path
          d="M 185 200 C 230 180 215 270 245 270"
          stroke="var(--accent-cta)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="6 6"
          fill="none"
        />
        <path
          d="M 240 262 L 250 270 L 240 278"
          stroke="var(--accent-cta)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* 3. Output Receipt (Order / Clarity / Verification) */}
      <g transform="translate(195, 210)">
        {/* Receipt shadow backing */}
        <rect
          x="6"
          y="6"
          width="165"
          height="225"
          rx="18"
          fill="var(--shadow-color)"
          opacity="0.25"
        />
        {/* Main receipt page */}
        <rect
          x="0"
          y="0"
          width="165"
          height="225"
          rx="18"
          fill="var(--bg-elevated)"
          stroke="var(--border-default)"
          strokeWidth="2.5"
        />

        {/* Receipt header */}
        <rect x="22" y="24" width="75" height="12" rx="6" fill="var(--accent-ai)" opacity="0.4" />
        <rect x="105" y="24" width="38" height="12" rx="6" fill="var(--accent-success)" opacity="0.3" />

        {/* Clean line items */}
        <rect x="22" y="52" width="121" height="6" rx="3" fill="var(--border-subtle)" />
        <rect x="22" y="66" width="85" height="6" rx="3" fill="var(--border-subtle)" />
        <rect x="22" y="80" width="105" height="6" rx="3" fill="var(--border-subtle)" />

        {/* Divider dash line */}
        <line
          x1="22"
          y1="102"
          x2="143"
          y2="102"
          stroke="var(--border-subtle)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Result summary row */}
        <rect x="22" y="116" width="60" height="8" rx="4" fill="var(--text-secondary)" opacity="0.4" />
        <rect x="95" y="114" width="48" height="12" rx="6" fill="var(--accent-success)" opacity="0.25" />

        {/* Big Celebratory Checkmark */}
        <g transform="translate(82, 168)">
          <circle
            cx="0"
            cy="0"
            r="28"
            fill="var(--bg-surface)"
            stroke="var(--accent-success)"
            strokeWidth="3.5"
          />
          <path
            d="M -11 0 L -3 8 L 12 -7"
            stroke="var(--accent-success)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>
    </svg>
  );
}
