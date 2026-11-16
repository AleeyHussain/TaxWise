import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ResultActionButtons({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onRestart} className="btn btn-secondary">
        Start over
      </button>
      <Link href="/compare" className="btn btn-ghost">
        Compare all plans
      </Link>
      <Link href="/assistant" className="btn btn-ghost">
        Ask the assistant
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
