import { products } from "./catalogue";
import { FEATURE_LABELS } from "./feature-labels";
import type { FeatureKey, ProductCategory } from "@/types";

export type CategoryFilter = "all" | ProductCategory;
export type SortOption = "default" | "price-asc" | "price-desc";

export const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All plans" },
  { value: "personal", label: "Personal" },
  { value: "self-employed", label: "Self-employed" },
  { value: "expert", label: "Expert" },
  { value: "corporate", label: "Corporate" },
];

export function searchableText(productIndex: number): string {
  const p = products[productIndex];
  const supported = (Object.keys(p.supports) as FeatureKey[])
    .filter((k) => p.supports[k])
    .map((k) => FEATURE_LABELS[k]);
  return [p.name, p.tagline, p.bestFor, ...p.highlights, ...supported]
    .join(" ")
    .toLowerCase();
}
