import { Check, X } from "lucide-react";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { formatPrice } from "@/lib/format";
import type { FeatureKey, Product } from "@/types";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as FeatureKey[];

export function ProductRow({
  product,
  issues,
  isOpen,
  onToggle,
}: {
  product: Product;
  issues: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const supported = FEATURE_KEYS.filter((k) => product.supports[k]);
  const unsupported = FEATURE_KEYS.filter((k) => !product.supports[k]);

  return (
    <div className="card overflow-hidden border-subtle bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-elevated"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-primary">
              {product.name}
            </span>
            <code className="rounded bg-elevated border border-subtle px-1.5 py-0.5 text-xs text-secondary font-mono">
              {product.id}
            </code>
            {issues.length === 0 ? (
              <span className="badge badge-brand">valid</span>
            ) : (
              <span className="badge badge-amber">{issues.length} issue(s)</span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-secondary">
            {product.bestFor}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-semibold text-trust">
            {formatPrice(product.price)}
          </span>
          <span className="text-secondary">{isOpen ? "-" : "+"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-subtle p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-secondary">
                Category
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {product.category}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-secondary">
                Price
              </dt>
              <dd className="mt-1 text-sm text-primary">
                {product.price === 0 ? "Free" : `${product.price} ${product.currency}`}
              </dd>
            </div>
          </dl>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-primary">
                Supported features
              </p>
              <ul className="mt-2 space-y-1">
                {supported.map((k) => (
                  <li key={k} className="flex items-center gap-2 text-sm text-secondary">
                    <Check className="h-4 w-4 text-success" />
                    {FEATURE_LABELS[k]}
                  </li>
                ))}
                {supported.length === 0 && (
                  <li className="text-sm text-secondary">None</li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                Unsupported features
              </p>
              <ul className="mt-2 space-y-1">
                {unsupported.map((k) => (
                  <li key={k} className="flex items-center gap-2 text-sm text-secondary opacity-60">
                    <X className="h-4 w-4" />
                    {FEATURE_LABELS[k]}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {issues.length > 0 && (
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
              <p className="font-semibold">Schema issues</p>
              <ul className="mt-1 list-disc pl-5">
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
