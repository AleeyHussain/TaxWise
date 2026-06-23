// Shared types for the whole app. The product feature flags, the questionnaire
// answers, and the recommendation result all live here so the data file, the
// engine, the API routes and the UI agree on one shape.

// The canonical list of feature flags a product can support. This is the single
// source of truth that drives the comparison table, the admin grid and the
// assistant grounding context.
export type FeatureKey =
  | "salaryIncome"
  | "studentIncome"
  | "basicPersonalReturn"
  | "medicalExpenses"
  | "donations"
  | "employmentExpenses"
  | "familyDeductions"
  | "investmentIncome"
  | "capitalGains"
  | "foreignIncome"
  | "rentalIncome"
  | "freelanceIncome"
  | "gigWorkIncome"
  | "businessExpenses"
  | "homeOfficeExpenses"
  | "vehicleExpenses"
  | "expertHelp"
  | "fullService"
  | "corporateFiling"
  | "nilCorporateReturn";

export type Supports = Record<FeatureKey, boolean>;

// One product in the catalogue. `supports` is the structured data the engine and
// tables read. `highlights` and `notSupported` are the human-readable bullet
// lists shown on the product cards (taken straight from the product brief).
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  category: ProductCategory;
  tagline: string;
  description: string;
  bestFor: string;
  highlights: string[];
  notSupported: string[];
  supports: Supports;
}

export type ProductCategory = "personal" | "self-employed" | "expert" | "corporate";

// ---- Questionnaire input model ----

export type FilingType = "personal" | "self_employed" | "incorporated";

export type IncomeSource =
  | "salaryIncome"
  | "studentIncome"
  | "investmentIncome"
  | "capitalGains"
  | "rentalIncome"
  | "freelanceIncome"
  | "gigWorkIncome"
  | "businessRevenue"
  | "foreignIncome";

export type Deduction =
  | "medicalExpenses"
  | "donations"
  | "employmentExpenses"
  | "homeOfficeExpenses"
  | "vehicleExpenses"
  | "businessExpenses"
  | "none";

export type HelpPreference = "self" | "expert_help" | "expert_file";

export interface QuestionnaireAnswers {
  filingType: FilingType | null;
  incomeSources: IncomeSource[];
  deductions: Deduction[];
  helpPreference: HelpPreference | null;
  // Only relevant when filingType is "incorporated".
  companyHadRevenue: boolean | null;
}

// ---- Engine output ----

export type Confidence = "low" | "medium" | "high";

export interface OptionalUpgrade {
  productId: string;
  productName: string;
  reason: string;
}

export interface RecommendationResult {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: Confidence;
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: OptionalUpgrade;
  warnings?: string[];
  disclaimer: string;
}

// ---- Assistant output ----

export interface AssistantResponse {
  answer: string;
  recommendedProduct: string | null;
  confidence: Confidence;
  reasons: string[];
  disclaimer: string;
  // Lets the UI show whether the reply came from the live model or the
  // built-in fallback. Handy for graders and for debugging.
  source: "ai" | "simulated";
}

// A validation problem found before we run the engine.
export interface ValidationError {
  field: string;
  message: string;
}
