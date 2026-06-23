import type { FeatureKey, Product, Supports } from "@/lib/types";

// Every feature flag a product could have, all off by default. Each product
// turns on the ones it supports. Keeping the full key set here means a missing
// flag is always `false` rather than `undefined`, which keeps the comparison
// table and the admin grid honest.
const NO_FEATURES: Supports = {
  salaryIncome: false,
  studentIncome: false,
  basicPersonalReturn: false,
  medicalExpenses: false,
  donations: false,
  employmentExpenses: false,
  familyDeductions: false,
  investmentIncome: false,
  capitalGains: false,
  foreignIncome: false,
  rentalIncome: false,
  freelanceIncome: false,
  gigWorkIncome: false,
  businessExpenses: false,
  homeOfficeExpenses: false,
  vehicleExpenses: false,
  expertHelp: false,
  fullService: false,
  corporateFiling: false,
  nilCorporateReturn: false,
};

// Turn on a list of features on top of the all-off base.
function withFeatures(...keys: FeatureKey[]): Supports {
  const next: Supports = { ...NO_FEATURES };
  for (const key of keys) next[key] = true;
  return next;
}

// Human-readable label for each feature flag. Used by the comparison table,
// the admin page, and the reasons the engine writes out.
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  salaryIncome: "Salary income",
  studentIncome: "Student income",
  basicPersonalReturn: "Basic personal return",
  medicalExpenses: "Medical expenses",
  donations: "Donations",
  employmentExpenses: "Employment expenses",
  familyDeductions: "Family deductions",
  investmentIncome: "Investment income",
  capitalGains: "Capital gains",
  foreignIncome: "Foreign income",
  rentalIncome: "Rental income",
  freelanceIncome: "Freelance income",
  gigWorkIncome: "Gig-work income",
  businessExpenses: "Business expenses",
  homeOfficeExpenses: "Home-office expenses",
  vehicleExpenses: "Vehicle expenses",
  expertHelp: "Expert help",
  fullService: "Full service",
  corporateFiling: "Corporate filing",
  nilCorporateReturn: "Nil return",
};

export const products: Product[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "CAD",
    category: "personal",
    tagline: "A simple return at no cost.",
    description:
      "For a straightforward personal return with salary or student income and nothing unusual going on.",
    bestFor: "Users with a simple personal tax situation.",
    highlights: [
      "Salary income",
      "Student income",
      "Basic personal return",
      "Simple tax slips",
    ],
    notSupported: [
      "Medical expenses",
      "Donations",
      "Investment income",
      "Rental income",
      "Self-employment income",
      "Business income",
      "Expert help",
    ],
    supports: withFeatures("salaryIncome", "studentIncome", "basicPersonalReturn"),
  },
  {
    id: "deluxe",
    name: "Deluxe",
    price: 30,
    currency: "CAD",
    category: "personal",
    tagline: "Cover the common deductions most people claim.",
    description:
      "Everything in Free, plus the everyday deductions like medical costs, donations and employment expenses.",
    bestFor: "Users with common deductions and expenses.",
    highlights: [
      "Everything in Free",
      "Medical expenses",
      "Donations",
      "Employment expenses",
      "Family-related deductions",
    ],
    notSupported: [
      "Investment income",
      "Rental income",
      "Self-employment income",
      "Corporate tax filing",
    ],
    supports: withFeatures(
      "salaryIncome",
      "studentIncome",
      "basicPersonalReturn",
      "medicalExpenses",
      "donations",
      "employmentExpenses",
      "familyDeductions",
    ),
  },
  {
    id: "premier",
    name: "Premier",
    price: 50,
    currency: "CAD",
    category: "personal",
    tagline: "Built for investments, rentals and foreign income.",
    description:
      "Everything in Deluxe, plus investment income, capital gains, foreign income and rental income.",
    bestFor: "Users with investments, rental income, capital gains, or foreign income.",
    highlights: [
      "Everything in Deluxe",
      "Investment income",
      "Capital gains",
      "Foreign income",
      "Rental income",
    ],
    notSupported: ["Self-employment income", "Corporate tax filing"],
    supports: withFeatures(
      "salaryIncome",
      "studentIncome",
      "basicPersonalReturn",
      "medicalExpenses",
      "donations",
      "employmentExpenses",
      "familyDeductions",
      "investmentIncome",
      "capitalGains",
      "foreignIncome",
      "rentalIncome",
    ),
  },
  {
    id: "self-employed",
    name: "Self-Employed",
    price: 70,
    currency: "CAD",
    category: "self-employed",
    tagline: "For freelancers, contractors and gig workers.",
    description:
      "Handles freelance and gig income along with the business expenses that come with working for yourself.",
    bestFor: "Freelancers, contractors, gig workers, and sole proprietors.",
    highlights: [
      "Salary and student income",
      "Medical expenses and donations",
      "Investment income",
      "Rental income",
      "Freelance income",
      "Gig-work income",
      "Business expenses",
      "Home-office expenses",
      "Vehicle expenses",
    ],
    notSupported: ["Incorporated business filing"],
    supports: withFeatures(
      "salaryIncome",
      "studentIncome",
      "basicPersonalReturn",
      "medicalExpenses",
      "donations",
      "investmentIncome",
      "rentalIncome",
      "freelanceIncome",
      "gigWorkIncome",
      "businessExpenses",
      "homeOfficeExpenses",
      "vehicleExpenses",
    ),
  },
  {
    id: "expert-assist",
    name: "Expert Assist",
    price: 120,
    currency: "CAD",
    category: "expert",
    tagline: "File it yourself, with an expert on call.",
    description:
      "You stay in the driver's seat but get expert chat, a video call and an expert review before you file.",
    bestFor: "Users who want to file themselves but need help from a tax expert.",
    highlights: [
      "All personal tax situations",
      "Expert chat",
      "Expert video call",
      "Expert review before filing",
    ],
    notSupported: ["Full handoff filing", "Incorporated business filing"],
    supports: withFeatures(
      "salaryIncome",
      "studentIncome",
      "basicPersonalReturn",
      "medicalExpenses",
      "donations",
      "employmentExpenses",
      "familyDeductions",
      "investmentIncome",
      "capitalGains",
      "foreignIncome",
      "rentalIncome",
      "freelanceIncome",
      "gigWorkIncome",
      "businessExpenses",
      "homeOfficeExpenses",
      "vehicleExpenses",
      "expertHelp",
    ),
  },
  {
    id: "expert-full-service",
    name: "Expert Full Service",
    price: 250,
    currency: "CAD",
    category: "expert",
    tagline: "Hand it over and an expert files for you.",
    description:
      "Upload your documents and a tax expert prepares and files the return, with progress tracking along the way.",
    bestFor: "Users who want an expert to prepare and file their return.",
    highlights: [
      "All personal tax situations",
      "Document upload",
      "Expert prepares your return",
      "Expert files your return",
      "Progress tracking",
    ],
    notSupported: ["Incorporated business filing"],
    supports: withFeatures(
      "salaryIncome",
      "studentIncome",
      "basicPersonalReturn",
      "medicalExpenses",
      "donations",
      "employmentExpenses",
      "familyDeductions",
      "investmentIncome",
      "capitalGains",
      "foreignIncome",
      "rentalIncome",
      "freelanceIncome",
      "gigWorkIncome",
      "businessExpenses",
      "homeOfficeExpenses",
      "vehicleExpenses",
      "expertHelp",
      "fullService",
    ),
  },
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
    supports: withFeatures("corporateFiling"),
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

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// Throwing variant for code paths where the id is known to be valid (the engine
// only ever asks for ids that exist in this file).
export function requireProduct(id: string): Product {
  const product = getProductById(id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}
