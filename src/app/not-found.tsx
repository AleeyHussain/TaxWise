import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="card max-w-md p-8 border-subtle bg-surface">
        <span className="text-4xl font-extrabold text-trust">404</span>
        <h1 className="mt-2 text-2xl font-bold text-primary">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-secondary leading-relaxed">
          We couldn&apos;t find the page you&apos;re looking for. It may have moved or doesn&apos;t exist.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link href="/products" className="btn btn-secondary">
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
