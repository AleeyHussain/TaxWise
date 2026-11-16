"use client";

import type { Confidence } from "@/types/recommendation";

const STYLES: Record<Confidence, string> = {
  high: "bg-ai/10 text-ai border border-ai/30",
  medium: "bg-warning/10 text-warning border border-warning/30",
  low: "bg-elevated text-secondary border border-subtle",
};

export default function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`badge ${STYLES[confidence]}`}>
      <span
        className={`h-2 w-2 rounded-full ${
          confidence === "high"
            ? "bg-ai animate-pulse"
            : confidence === "medium"
              ? "bg-warning"
              : "bg-secondary opacity-40"
        }`}
        aria-hidden="true"
      />
      <span className="capitalize">{confidence}</span> confidence match
    </span>
  );
}
