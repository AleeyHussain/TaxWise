import Link from "next/link";
import { products } from "@/features/products/catalogue";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { SchemaCheckPanel } from "./_components/SchemaCheckPanel";

export default function AdminDashboardPage() {
  const isGroqConfigured = Boolean(process.env.GROQ_API_KEY);
  const trackedFeaturesCount = Object.keys(FEATURE_LABELS).length;

  return (
    <div className="container-px py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-secondary">
            System health, environment variables status, and configuration summary.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="btn btn-primary">
            View Catalogue
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="btn btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <SchemaCheckPanel
        totalProducts={products.length}
        trackedFeatures={trackedFeaturesCount}
        totalIssues={0}
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="card p-6 border-subtle bg-surface">
          <h2 className="text-lg font-bold text-primary">
            Environment & Integration Health
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-subtle pb-2">
              <span className="text-sm text-secondary">GROQ_API_KEY</span>
              <span
                className={`badge ${
                  isGroqConfigured ? "badge-brand" : "badge-amber"
                }`}
              >
                {isGroqConfigured ? "Configured (Active)" : "Unset (Simulated Mode)"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-subtle pb-2">
              <span className="text-sm text-secondary">Admin Auth Status</span>
              <span className="badge badge-brand">Protected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Environment Mode</span>
              <span className="badge badge-slate">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        <div className="card p-6 border-subtle bg-surface">
          <h2 className="text-lg font-bold text-primary">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Manage your product catalogue, inspect feature flags, and export configuration.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/products" className="btn btn-secondary btn-sm">
              Manage Products &rarr;
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm">
              Live Preview &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
