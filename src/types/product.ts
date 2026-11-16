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

export type ProductCategory = "personal" | "self-employed" | "expert" | "corporate";

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
