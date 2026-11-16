import type { Product } from "@/types/product";
import { standardPlans } from "./standard-plans";
import { expertPlans } from "./expert-plans";

export const personalPlans: Product[] = [...standardPlans, ...expertPlans];
