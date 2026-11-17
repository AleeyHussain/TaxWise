import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="glass-2 max-w-md p-8 rounded-2xl">
        <span className="text-4xl font-extrabold text-trust">404</span>
        <h1 className="mt-2 text-2xl font-bold text-primary">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-secondary leading-relaxed">
          We couldn&apos;t find the page you&apos;re looking for. It may have moved or doesn&apos;t exist.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">
              View Plans
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
