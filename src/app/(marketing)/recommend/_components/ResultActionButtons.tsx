import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ResultActionButtons({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" onClick={onRestart} variant="secondary">
        Start over
      </Button>
      <Button asChild variant="ghost">
        <Link href="/compare">
          Compare all plans
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link href="/assistant">
          Ask the assistant
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
