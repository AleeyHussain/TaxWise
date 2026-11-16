"use client";

import { useEffect } from "react";
import Link from "next/link";

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
      <div className="card max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          An unexpected error occurred while loading this page. You can try again or return home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={() => reset()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
