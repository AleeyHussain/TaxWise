import type { Product } from "@/types/product";
import { personalPlans } from "./personal-plans";
import { corporatePlans } from "./corporate-plans";

export const products: Product[] = [...personalPlans, ...corporatePlans];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function requireProduct(id: string): Product {
  const product = getProductById(id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}
