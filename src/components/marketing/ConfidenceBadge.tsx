import type { Confidence } from "@/types/recommendation";

const STYLES: Record<Confidence, string> = {
  high: "bg-cyan-100/80 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800",
  medium: "bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
};

export default function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`badge ${STYLES[confidence]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {confidence} confidence match
    </span>
  );
}
