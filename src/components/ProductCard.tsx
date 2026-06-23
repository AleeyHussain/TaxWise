import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import type { Product, ProductCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  personal: "Personal",
  "self-employed": "Self-employed",
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

  return (
    <div className="card flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="badge badge-slate">{CATEGORY_LABELS[product.category]}</span>
        <span className="text-right text-sm font-semibold text-brand-700 dark:text-brand-300">
          {formatPrice(product.price)}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
        {product.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.tagline}</p>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium text-slate-700 dark:text-slate-200">Best for: </span>
        {product.bestFor}
      </p>

      <ul className="mt-4 space-y-1.5">
        {shown.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3 pt-2">
        <Link href="/recommend" className="btn btn-primary btn-sm">
          Check my fit
        </Link>
        <Link href="/compare" className="btn btn-ghost btn-sm">
          Compare
        </Link>
      </div>
    </div>
  );
}
