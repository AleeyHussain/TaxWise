import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, CrossIcon } from "@/components/icons";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { products } from "@/features/products/catalogue";
import { formatPrice } from "@/lib/format";
import type { FeatureKey } from "@/types";

export const metadata: Metadata = {
  title: "Compare Tax Plans — TaxWise",
  description:
    "Compare all 8 TaxWise plans side by side by price and supported tax schedules.",
};

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
    <span className="inline-flex items-center justify-center" title="Supported">
      <CheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      <span className="sr-only">Supported</span>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center" title="Not supported">
      <CrossIcon className="h-5 w-5 text-slate-300 dark:text-slate-600" />
      <span className="sr-only">Not supported</span>
    </span>
  );
}

export default function ComparePage() {
  return (
    <div className="container-px py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Compare plans
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          Side by side, by price and the tax features that matter most. Scroll
          horizontally on small screens to see all 8 plans.
        </p>
      </header>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <caption className="sr-only">TaxWise Plan Comparison Matrix</caption>
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900">
              <th scope="col" className="sticky left-0 z-10 bg-slate-50 p-4 text-left font-bold text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="p-4 text-center font-bold text-slate-900 dark:text-white"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <th scope="row" className="sticky left-0 z-10 bg-white p-4 text-left font-semibold text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                Price
              </th>
              {products.map((p) => (
                <td
                  key={p.id}
                  className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400"
                >
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>

            {COMPARE_FEATURES.map((feature, i) => (
              <tr
                key={feature}
                className={`border-t border-slate-200 dark:border-slate-800 ${
                  i % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-900/40" : ""
                }`}
              >
                <th
                  scope="row"
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
          Not sure? Find my plan
        </Link>
        <Link href="/products" className="btn btn-secondary">
          View plan details
        </Link>
      </div>
    </div>
  );
}
