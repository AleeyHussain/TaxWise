"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import ProductCard from "@/components/marketing/ProductCard";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { products } from "@/features/products/catalogue";
import { searchableText, CATEGORY_OPTIONS, type CategoryFilter, type SortOption } from "@/features/products/search";
import type { FeatureKey } from "@/types";
import { Button } from "@/components/ui/Button";

export default function ProductsClientView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const planMatches = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .map((p) => ({ label: p.name, type: "Plan" }));

    const featureMatches = (Object.entries(FEATURE_LABELS) as [FeatureKey, string][])
      .filter(([, label]) => label.toLowerCase().includes(q))
      .map(([, label]) => ({ label, type: "Feature" }));

    return [...planMatches, ...featureMatches].slice(0, 6);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setComboboxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="container-px py-12 md:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Products
        </h1>
        <p className="mt-3 text-secondary leading-relaxed">
          Every plan we offer. Filter by type, sort by price, or search for a
          tax feature like &ldquo;rental&rdquo;, &ldquo;home office&rdquo;, or &ldquo;crypto&rdquo;.
        </p>
      </header>

      {/* Controls */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div ref={containerRef} className="relative lg:col-span-2">
          <label htmlFor="search" className="sr-only">
            Search by plan or feature
          </label>
          <input
            id="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={comboboxOpen && suggestions.length > 0}
            aria-controls="search-suggestions"
            type="search"
            value={query}
            onFocus={() => setComboboxOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setComboboxOpen(true);
            }}
            placeholder="Search plans or features (e.g. rental, capital gains)..."
            className="input pr-8"
          />

          {comboboxOpen && suggestions.length > 0 && (
            <ul
              id="search-suggestions"
              role="listbox"
              className="absolute left-0 top-full z-30 mt-1.5 w-full rounded-xl border border-subtle bg-surface p-1.5 shadow-xl"
            >
              {suggestions.map((s) => (
                <li
                  key={`${s.type}-${s.label}`}
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    setQuery(s.label);
                    setComboboxOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="rounded bg-elevated border border-subtle px-1.5 py-0.5 text-[10px] font-semibold text-secondary uppercase">
                    {s.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="category" className="sr-only">
            Filter by category
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
            Sort options
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="input"
          >
            <option value="default">Sort: Recommended order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-secondary">
        Showing {visible.length} of {products.length} plans
      </p>

      {visible.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-secondary border border-subtle mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-primary">
            No matching tax plans
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-secondary">
            No plans matched &ldquo;{query}&rdquo; with the selected filters.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setSort("default");
            }}
            className="mt-5"
          >
            Reset all filters
          </Button>
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
