export function SchemaCheckPanel({
  totalProducts,
  trackedFeatures,
  totalIssues,
}: {
  totalProducts: number;
  trackedFeatures: number;
  totalIssues: number;
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="card p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">Total products</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {totalProducts}
        </p>
      </div>
      <div className="card p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">Tracked features</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          {trackedFeatures}
        </p>
      </div>
      <div className="card p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">Schema check</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            totalIssues === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {totalIssues === 0 ? "All valid" : `${totalIssues} issue(s)`}
        </p>
      </div>
    </div>
  );
}
