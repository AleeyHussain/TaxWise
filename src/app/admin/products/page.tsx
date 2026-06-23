"use client";

import { useMemo, useState } from "react";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { FEATURE_LABELS, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { FeatureKey, Product } from "@/lib/types";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as FeatureKey[];

// A light schema check so the page can flag a product that is missing fields or
// has an out-of-range value. This is the "validate product schema" bonus.
function validateProduct(product: Product): string[] {
  const issues: string[] = [];
  if (!product.id) issues.push("missing id");
  if (!product.name) issues.push("missing name");
  if (typeof product.price !== "number" || product.price < 0) issues.push("invalid price");
  if (product.currency !== "CAD") issues.push("currency should be CAD");
  if (!product.bestFor) issues.push("missing bestFor");
  if (!product.supports) issues.push("missing supports map");
  else {
    for (const key of FEATURE_KEYS) {
      if (typeof product.supports[key] !== "boolean") {
        issues.push(`supports.${key} is not a boolean`);
      }
    }
  }
  return issues;
}

export default function AdminProductsPage() {
  const [openId, setOpenId] = useState<string | null>(products[0]?.id ?? null);

  const validation = useMemo(
    () => products.map((p) => ({ product: p, issues: validateProduct(p) })),
    [],
  );
  const totalIssues = validation.reduce((sum, v) => sum + v.issues.length, 0);

  function exportJson() {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxwise-products.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container-px py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Product configuration
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            A read-only view of the product catalogue that drives the whole app.
            Every plan, price and feature flag here is the same data the engine,
            comparison table and assistant read from.
          </p>
        </div>
        <button type="button" onClick={exportJson} className="btn btn-secondary shrink-0">
          Export config as JSON
        </button>
      </header>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {products.length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Tracked features</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {FEATURE_KEYS.length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Schema check</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              totalIssues === 0
                ? "text-brand-700 dark:text-brand-300"
                : "text-amber-700 dark:text-amber-300"
            }`}
          >
            {totalIssues === 0 ? "All valid" : `${totalIssues} issue(s)`}
          </p>
        </div>
      </div>

      {/* Product rows */}
      <div className="mt-8 space-y-3">
        {validation.map(({ product, issues }) => {
          const isOpen = openId === product.id;
          const supported = FEATURE_KEYS.filter((k) => product.supports[k]);
          const unsupported = FEATURE_KEYS.filter((k) => !product.supports[k]);
          return (
            <div key={product.id} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : product.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {product.name}
                    </span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {product.id}
                    </code>
                    {issues.length === 0 ? (
                      <span className="badge badge-brand">valid</span>
                    ) : (
                      <span className="badge badge-amber">{issues.length} issue(s)</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                    {product.bestFor}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold text-brand-700 dark:text-brand-300">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-slate-400">{isOpen ? "-" : "+"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-200 p-5 dark:border-slate-800">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Category
                      </dt>
                      <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                        {product.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Price
                      </dt>
                      <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                        {product.price === 0 ? "Free" : `${product.price} ${product.currency}`}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Supported features
                      </p>
                      <ul className="mt-2 space-y-1">
                        {supported.map((k) => (
                          <li key={k} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <CheckIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            {FEATURE_LABELS[k]}
                          </li>
                        ))}
                        {supported.length === 0 && (
                          <li className="text-sm text-slate-400">None</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Unsupported features
                      </p>
                      <ul className="mt-2 space-y-1">
                        {unsupported.map((k) => (
                          <li key={k} className="flex items-center gap-2 text-sm text-slate-400">
                            <CrossIcon className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                            {FEATURE_LABELS[k]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {issues.length > 0 && (
                    <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
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
        })}
      </div>
    </div>
  );
}
