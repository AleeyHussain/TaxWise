"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product, ProductCategory } from "@/types/product";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  personal: "Personal",
  "self-employed": "Self-Employed",
  expert: "Expert Guidance",
  corporate: "Corporate",
};

export default function ProductCard({
  product,
  highlightCount = 4,
  isRecommended = false,
}: {
  product: Product;
  highlightCount?: number;
  isRecommended?: boolean;
}) {
  const shown = product.highlights.slice(0, highlightCount);
  const isExpert = product.category === "expert";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative card flex h-full flex-col justify-between p-6 transition-all duration-200 hover:shadow-xl hover:border-trust/40 ${
        isRecommended
          ? "border-ai/60 ring-2 ring-ai/40 shadow-md"
          : isExpert
            ? "border-premium/40"
            : "border-subtle"
      }`}
    >
      {/* Recommended subtle pulse ring on border only */}
      {isRecommended && (
        <span
          className="pointer-events-none absolute inset-0 -m-[2px] rounded-2xl border-2 border-ai/50 animate-pulse"
          aria-hidden="true"
        />
      )}

      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`badge ${
              isRecommended
                ? "badge-ai"
                : isExpert
                  ? "badge-amber"
                  : "badge-slate"
            }`}
          >
            {isRecommended && <Sparkles className="h-3 w-3 mr-1" />}
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="text-right text-base font-extrabold text-success transition-transform duration-200 group-hover:scale-105">
            {formatPrice(product.price)}
          </span>
        </div>

        <h3 className="mt-3.5 text-xl font-bold text-primary transition-colors duration-180 group-hover:text-trust">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-secondary leading-relaxed">
          {product.tagline}
        </p>

        <p className="mt-4 text-xs text-secondary">
          <span className="font-semibold text-primary">Best for: </span>
          {product.bestFor}
        </p>

        <ul className="mt-5 space-y-2 border-t border-subtle pt-4">
          {shown.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-secondary">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-2">
        <Link
          href={`/recommend`}
          className="btn btn-secondary w-full text-xs font-semibold group-hover:border-trust/60 group-hover:text-trust transition-all duration-180"
        >
          <span>Choose plan</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-180 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
