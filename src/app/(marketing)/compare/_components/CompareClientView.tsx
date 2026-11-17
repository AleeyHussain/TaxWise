"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Check, X, SlidersHorizontal, ArrowRight } from "lucide-react";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { products } from "@/features/products/catalogue";
import { formatPrice } from "@/lib/format";
import type { FeatureKey } from "@/types";
import type { ProductCategory } from "@/types/product";

const COMPARE_FEATURES: FeatureKey[] = [
  "salaryIncome",
  "donations",
  "medicalExpenses",
  "investmentIncome",
  "rentalIncome",
  "freelanceIncome",
  "businessExpenses",
  "expertHelp",
  "fullService",
  "corporateFiling",
  "nilCorporateReturn",
];

export default function CompareClientView() {
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [category]);

  const visibleFeatures = useMemo(() => {
    if (!onlyDifferences) return COMPARE_FEATURES;
    return COMPARE_FEATURES.filter((feature) => {
      const firstVal = filteredProducts[0]?.supports[feature];
      return filteredProducts.some((p) => p.supports[feature] !== firstVal);
    });
  }, [onlyDifferences, filteredProducts]);

  return (
    <div className="space-y-6">
      {/* Controls & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-subtle bg-surface/70 p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider mr-1">
            Category:
          </span>
          {(
            [
              ["all", `All (${products.length})`],
              ["personal", "Personal"],
              ["self-employed", "Self-Employed"],
              ["corporate", "Corporate"],
            ] as const
          ).map(([cat, label]) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-trust text-white shadow-xs"
                  : "bg-elevated/70 text-secondary hover:text-primary hover:bg-elevated"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-secondary hover:text-primary select-none">
          <input
            type="checkbox"
            checked={onlyDifferences}
            onChange={(e) => setOnlyDifferences(e.target.checked)}
            className="h-4 w-4 rounded border-subtle text-trust focus:ring-trust"
          />
          <SlidersHorizontal className="h-3.5 w-3.5 text-trust" />
          <span>Highlight differences only</span>
        </label>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-subtle bg-surface/80 shadow-md backdrop-blur-md">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">TaxWise Plan Comparison Matrix</caption>
          <thead>
            <tr className="border-b border-subtle bg-elevated/80 backdrop-blur-md">
              <th scope="col" className="sticky left-0 z-20 bg-elevated/95 p-4 text-left font-bold text-primary backdrop-blur-md min-w-[180px]">
                Plan Name
              </th>
              {filteredProducts.map((p) => (
                <th key={p.id} scope="col" className="p-4 text-center min-w-[140px]">
                  <p className="font-bold text-primary">{p.name}</p>
                  <p className="mt-1 text-base font-extrabold text-success">{formatPrice(p.price)}</p>
                  <Link
                    href="/recommend"
                    className="mt-2 inline-flex items-center gap-1 rounded-lg border border-subtle bg-surface px-2.5 py-1 text-[11px] font-semibold text-secondary hover:border-trust hover:text-trust transition-colors"
                  >
                    <span>Choose</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleFeatures.map((feature, i) => (
              <tr
                key={feature}
                className={`border-t border-subtle transition-colors hover:bg-elevated/30 ${
                  i % 2 === 0 ? "bg-elevated/20" : ""
                }`}
              >
                <th
                  scope="row"
                  className={`sticky left-0 z-10 p-4 text-left font-medium text-secondary backdrop-blur-md ${
                    i % 2 === 0 ? "bg-surface/95" : "bg-surface/90"
                  }`}
                >
                  {FEATURE_LABELS[feature]}
                </th>
                {filteredProducts.map((p) => {
                  const supported = p.supports[feature];
                  return (
                    <td key={p.id} className="p-4 text-center">
                      {supported ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-elevated text-secondary/40">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
