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
      <div className="card p-5 border-subtle bg-surface">
        <p className="text-sm text-secondary">Total products</p>
        <p className="mt-1 text-2xl font-bold text-primary">
          {totalProducts}
        </p>
      </div>
      <div className="card p-5 border-subtle bg-surface">
        <p className="text-sm text-secondary">Tracked features</p>
        <p className="mt-1 text-2xl font-bold text-primary">
          {trackedFeatures}
        </p>
      </div>
      <div className="card p-5 border-subtle bg-surface">
        <p className="text-sm text-secondary">Schema check</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            totalIssues === 0 ? "text-success" : "text-warning"
          }`}
        >
          {totalIssues === 0 ? "All valid" : `${totalIssues} issue(s)`}
        </p>
      </div>
    </div>
  );
}
