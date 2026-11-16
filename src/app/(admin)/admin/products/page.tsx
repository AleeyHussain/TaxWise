"use client";

import { useMemo, useState } from "react";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { products } from "@/features/products/catalogue";
import type { FeatureKey, Product } from "@/types";
import { ProductRow } from "../_components/ProductRow";
import { SchemaCheckPanel } from "../_components/SchemaCheckPanel";

const FEATURE_KEYS = Object.keys(FEATURE_LABELS) as FeatureKey[];

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

      <SchemaCheckPanel
        totalProducts={products.length}
        trackedFeatures={FEATURE_KEYS.length}
        totalIssues={totalIssues}
      />

      <div className="mt-8 space-y-3">
        {validation.map(({ product, issues }) => (
          <ProductRow
            key={product.id}
            product={product}
            issues={issues}
            isOpen={openId === product.id}
            onToggle={() => setOpenId(openId === product.id ? null : product.id)}
          />
        ))}
      </div>
    </div>
  );
}
