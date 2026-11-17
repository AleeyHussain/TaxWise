import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/branding/Logo";
import NotFoundIllustration from "@/components/illustrations/NotFoundIllustration";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <div className="glass-2 max-w-md p-8 rounded-3xl flex flex-col items-center shadow-xl">
        <Logo size={44} variant="full" className="mb-2" />
        <NotFoundIllustration className="w-40 h-40 my-2 select-none" />
        <span className="text-3xl font-extrabold text-trust tracking-tight">404</span>
        <h1 className="mt-1 text-2xl font-bold text-primary">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-secondary leading-relaxed">
          This page got lost in the paperwork. We couldn&apos;t find what you&apos;re looking for.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">View Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
