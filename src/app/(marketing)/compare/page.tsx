import type { Metadata } from "next";
import Link from "next/link";
import CompareClientView from "./_components/CompareClientView";

export const metadata: Metadata = {
  title: "Compare Tax Plans — TaxWise",
  description:
    "Compare all 8 TaxWise plans side by side by price and supported tax schedules.",
};

export default function ComparePage() {
  return (
    <div className="container-px py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Compare plans
        </h1>
        <p className="mt-3 text-secondary leading-relaxed">
          Side by side, by price and the tax features that matter most. Filter
          by category or highlight key differences to find your fit faster.
        </p>
      </header>

      <div className="mt-8">
        <CompareClientView />
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
