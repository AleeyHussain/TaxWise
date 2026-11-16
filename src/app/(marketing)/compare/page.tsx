import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
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
      <Check className="h-5 w-5 text-success" />
      <span className="sr-only">Supported</span>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center opacity-40 text-secondary" title="Not supported">
      <X className="h-4 w-4" />
      <span className="sr-only">Not supported</span>
    </span>
  );
}

export default function ComparePage() {
  return (
    <div className="container-px py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Compare plans
        </h1>
        <p className="mt-3 text-secondary leading-relaxed">
          Side by side, by price and the tax features that matter most. Scroll
          horizontally on small screens to see all 8 plans.
        </p>
      </header>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-subtle shadow-sm bg-surface">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <caption className="sr-only">TaxWise Plan Comparison Matrix</caption>
          <thead>
            <tr className="bg-elevated">
              <th scope="col" className="sticky left-0 z-10 bg-elevated p-4 text-left font-bold text-primary">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="p-4 text-center font-bold text-primary"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-subtle">
              <th scope="row" className="sticky left-0 z-10 bg-surface p-4 text-left font-semibold text-primary">
                Price
              </th>
              {products.map((p) => (
                <td
                  key={p.id}
                  className="p-4 text-center font-bold text-success"
                >
                  {formatPrice(p.price)}
                </td>
              ))}
            </tr>

            {COMPARE_FEATURES.map((feature, i) => (
              <tr
                key={feature}
                className={`border-t border-subtle ${
                  i % 2 === 0 ? "bg-elevated/40" : ""
                }`}
              >
                <th
                  scope="row"
                  className={`sticky left-0 z-10 p-4 text-left font-medium text-secondary ${
                    i % 2 === 0 ? "bg-elevated/60" : "bg-surface"
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
