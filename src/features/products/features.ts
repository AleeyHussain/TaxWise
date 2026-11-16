import type { FeatureKey, Supports } from "@/types/product";

export const NO_FEATURES: Supports = {
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

export function withFeatures(...keys: FeatureKey[]): Supports {
  const next: Supports = { ...NO_FEATURES };
  for (const key of keys) next[key] = true;
  return next;
}
