import type { Confidence } from "@/lib/types";

const STYLES: Record<Confidence, string> = {
  high: "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`badge ${STYLES[confidence]}`}>
      {confidence} confidence
    </span>
  );
}
