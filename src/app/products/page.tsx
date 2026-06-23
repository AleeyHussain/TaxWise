"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { FEATURE_LABELS, products } from "@/data/products";
import type { FeatureKey, ProductCategory } from "@/lib/types";

type CategoryFilter = "all" | ProductCategory;
type SortOption = "default" | "price-asc" | "price-desc";

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All plans" },
  { value: "personal", label: "Personal" },
  { value: "self-employed", label: "Self-employed" },
  { value: "expert", label: "Expert" },
  { value: "corporate", label: "Corporate" },
];

// Build the searchable text for a product once: name, tagline, best-for, the
// marketing bullets and the labels of every feature it supports.
function searchableText(productIndex: number): string {
  const p = products[productIndex];
  const supported = (Object.keys(p.supports) as FeatureKey[])
    .filter((k) => p.supports[k])
    .map((k) => FEATURE_LABELS[k]);
  return [p.name, p.tagline, p.bestFor, ...p.highlights, ...supported]
    .join(" ")
    .toLowerCase();
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products
      .map((product, index) => ({ product, index }))
      .filter(({ product, index }) => {
        if (category !== "all" && product.category !== category) return false;
        if (q && !searchableText(index).includes(q)) return false;
        return true;
      })
      .map(({ product }) => product);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, sort]);

  return (
    <div className="container-px py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Every plan we offer. Filter by type, sort by price, or search for a
          feature like &ldquo;rental&rdquo; or &ldquo;home office&rdquo;.
        </p>
      </header>

      {/* Controls */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label htmlFor="search" className="sr-only">
            Search by feature
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by feature..."
            className="input"
          />
        </div>
        <div>
          <label htmlFor="category" className="sr-only">
            Filter by type
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            className="input"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="input"
          >
            <option value="default">Sort: recommended order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Showing {visible.length} of {products.length} plans
      </p>

      {visible.length === 0 ? (
        <div className="card mt-6 p-10 text-center text-slate-500 dark:text-slate-400">
          No plans match that search. Try a different feature or clear the filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} highlightCount={5} />
          ))}
        </div>
      )}
    </div>
  );
}
