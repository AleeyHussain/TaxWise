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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
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
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Environment & Integration Health
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-300">GROQ_API_KEY</span>
              <span
                className={`badge ${
                  isGroqConfigured ? "badge-brand" : "badge-amber"
                }`}
              >
                {isGroqConfigured ? "Configured (Active)" : "Unset (Simulated Mode)"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-sm text-slate-600 dark:text-slate-300">Admin Auth Status</span>
              <span className="badge badge-brand">Protected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">Environment Mode</span>
              <span className="badge badge-slate">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
