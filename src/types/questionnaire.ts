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
  companyHadRevenue: boolean | null;
}

export interface ValidationError {
  field: string;
  message: string;
}
