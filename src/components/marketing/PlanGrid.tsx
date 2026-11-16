import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import ProductCard from "./ProductCard";
import { getProductById } from "@/features/products/catalogue";

const PREVIEW_IDS = ["free", "deluxe", "self-employed", "expert-full-service"];

export default function PlanGrid() {
  const previews = PREVIEW_IDS.map((id) => getProductById(id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section className="container-px py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            A plan for every situation
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            From a free simple return to a full expert handoff.
          </p>
        </div>
        <Link href="/products" className="hidden shrink-0 sm:inline-flex btn btn-ghost btn-sm">
          See all plans
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {previews.map((product) => (
          <ProductCard key={product.id} product={product} highlightCount={3} />
        ))}
      </div>
      <div className="mt-8 sm:hidden">
        <Link href="/products" className="btn btn-secondary w-full">
          See all plans
        </Link>
      </div>
    </section>
  );
}
