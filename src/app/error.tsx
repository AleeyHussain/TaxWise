"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/branding/Logo";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="glass-2 max-w-md p-8 rounded-2xl flex flex-col items-center">
        <Logo size={44} variant="full" className="mb-4" />
        <h1 className="text-2xl font-bold text-primary">
          Something went wrong. Try again?
        </h1>
        <p className="mt-3 text-sm text-secondary leading-relaxed">
          An unexpected error occurred while calculating tax states. You can retry the current action or return to the main page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button type="button" onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">
              Return home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
