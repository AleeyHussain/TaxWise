import Link from "next/link";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { FEATURE_LABELS, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { FeatureKey } from "@/lib/types";

// The feature rows shown in the comparison, in the order from the brief.
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

function Supported({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex" title="Supported">
      <CheckIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
      <span className="sr-only">Supported</span>
    </span>
  ) : (
    <span className="inline-flex" title="Not supported">
      <CrossIcon className="h-5 w-5 text-slate-300 dark:text-slate-600" />
      <span className="sr-only">Not supported</span>
    </span>
  );
}

export default function ComparePage() {
  return (
    <div className="container-px py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Compare plans</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Side by side, by price and the features that tend to matter most. Scroll
          sideways on a small screen to see every plan.
        </p>
      </header>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900">
              <th className="sticky left-0 z-10 bg-slate-50 p-4 text-left font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className="p-4 text-center font-semibold text-slate-900 dark:text-white"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price row */}
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <th className="sticky left-0 z-10 bg-white p-4 text-left font-medium text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                Price
              </th>
              {products.map((p) => (
                <td
                  key={p.id}
                  className="p-4 text-center font-semibold text-brand-700 dark:text-brand-300"
                >
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>

            {/* Feature rows */}
            {COMPARE_FEATURES.map((feature, i) => (
              <tr
                key={feature}
                className={`border-t border-slate-200 dark:border-slate-800 ${
                  i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-900/40" : ""
                }`}
              >
                <th
                  className={`sticky left-0 z-10 p-4 text-left font-medium text-slate-700 dark:text-slate-200 ${
                    i % 2 === 0
                      ? "bg-slate-50 dark:bg-slate-900"
                      : "bg-white dark:bg-slate-950"
                  }`}
                >
                  {FEATURE_LABELS[feature]}
                </th>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <Supported value={p.supports[feature]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/recommend" className="btn btn-primary">
          Not sure? Find my product
        </Link>
        <Link href="/products" className="btn btn-secondary">
          View product details
        </Link>
      </div>
    </div>
  );
}
