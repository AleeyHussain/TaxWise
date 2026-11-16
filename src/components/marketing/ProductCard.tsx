import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import type { Product, ProductCategory } from "@/types/product";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  personal: "Personal",
  "self-employed": "Self-Employed",
  expert: "Expert",
  corporate: "Corporate",
};

export default function ProductCard({
  product,
  highlightCount = 4,
}: {
  product: Product;
  highlightCount?: number;
}) {
  const shown = product.highlights.slice(0, highlightCount);
  const isExpert = product.category === "expert";

  return (
    <div
      className={`card card-hover flex h-full flex-col p-6 transition-all duration-200 ${
        isExpert ? "border-amber-200/60 dark:border-amber-800/40" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`badge ${isExpert ? "badge-amber" : "badge-slate"}`}>
          {CATEGORY_LABELS[product.category]}
        </span>
        <span className="text-right text-base font-bold text-emerald-600 dark:text-emerald-400">
          {formatPrice(product.price)}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {product.tagline}
      </p>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-800 dark:text-slate-200">Best for: </span>
        {product.bestFor}
      </p>

      <ul className="mt-4 space-y-2 flex-1">
        {shown.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link href="/recommend" className="btn btn-primary btn-sm flex-1">
          Check my fit
        </Link>
        <Link href="/compare" className="btn btn-secondary btn-sm">
          Compare
        </Link>
      </div>
    </div>
  );
}
