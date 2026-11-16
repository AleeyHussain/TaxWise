import type { Product } from "@/types/product";
import { withFeatures } from "./features";

export const corporatePlans: Product[] = [
  {
    id: "business-corporate",
    name: "Business Corporate",
    price: 400,
    currency: "CAD",
    category: "corporate",
    tagline: "Corporate returns for incorporated companies.",
    description:
      "A corporate tax return for an incorporated company that had revenue during the year.",
    bestFor: "Incorporated companies.",
    highlights: [
      "Corporate tax return",
      "Business revenue",
      "Business expenses",
      "Corporate filing review",
    ],
    notSupported: ["Personal tax return"],
    supports: withFeatures(
      "corporateFiling",
      "businessRevenue",
      "businessExpenses",
    ),
  },
  {
    id: "nil-corporate-return",
    name: "Nil Corporate Return",
    price: 175,
    currency: "CAD",
    category: "corporate",
    tagline: "A nil return for a company with no revenue.",
    description:
      "For an incorporated company that had no revenue and needs to file a nil corporate return.",
    bestFor: "Incorporated companies with no revenue.",
    highlights: [
      "Incorporated company filing",
      "No-revenue company",
      "Nil return",
    ],
    notSupported: ["Personal tax return", "Companies with revenue"],
    supports: withFeatures("nilCorporateReturn"),
  },
];
