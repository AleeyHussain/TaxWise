import type { QuestionnaireAnswers, IncomeSource, Deduction } from "@/types/questionnaire";
import type { FeatureKey, Product } from "@/types/product";
import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { toSentenceList } from "./labels";

const INCOME_FEATURE_MAP: Record<IncomeSource, FeatureKey> = {
  salaryIncome: "salaryIncome",
  studentIncome: "studentIncome",
  investmentIncome: "investmentIncome",
  capitalGains: "capitalGains",
  rentalIncome: "rentalIncome",
  freelanceIncome: "freelanceIncome",
  gigWorkIncome: "gigWorkIncome",
  businessRevenue: "businessRevenue",
  foreignIncome: "foreignIncome",
};

const DEDUCTION_FEATURE_MAP: Partial<Record<Deduction, FeatureKey>> = {
  medicalExpenses: "medicalExpenses",
  donations: "donations",
  employmentExpenses: "employmentExpenses",
  homeOfficeExpenses: "homeOfficeExpenses",
  vehicleExpenses: "vehicleExpenses",
  businessExpenses: "businessExpenses",
};

export function buildWarnings(
  answers: QuestionnaireAnswers,
  recommendedProduct?: Product,
): { warnings: string[]; unsupportedFeatures: FeatureKey[] } {
  const warnings: string[] = [];
  const deductions = new Set(answers.deductions ?? []);

  const realDeductions = (answers.deductions ?? []).filter((d) => d !== "none");
  if (deductions.has("none") && realDeductions.length > 0) {
    warnings.push(
      'You picked "No special deductions" together with one or more specific deductions. We went with the specific deductions you selected.',
    );
  }

  if (answers.filingType === "incorporated") {
    const personalIncome = (answers.incomeSources ?? []).filter(
      (s) => s !== "businessRevenue",
    );
    if (personalIncome.length > 0) {
      warnings.push(
        "A corporate product covers the company return only. Personal income such as salary or investments is usually filed on a separate personal product.",
      );
    }
  }

  const unsupportedFeatures: FeatureKey[] = [];
  if (recommendedProduct) {
    const needed = new Set<FeatureKey>();
    for (const inc of answers.incomeSources ?? []) {
      const feat = INCOME_FEATURE_MAP[inc];
      if (feat) needed.add(feat);
    }
    for (const ded of answers.deductions ?? []) {
      const feat = DEDUCTION_FEATURE_MAP[ded];
      if (feat) needed.add(feat);
    }

    needed.forEach((feat) => {
      if (!recommendedProduct.supports[feat]) {
        unsupportedFeatures.push(feat);
      }
    });

    if (unsupportedFeatures.length > 0) {
      const labels = unsupportedFeatures.map((f) => FEATURE_LABELS[f].toLowerCase());
      warnings.push(
        `The plan we suggested does not cover ${toSentenceList(labels)}. Expert Assist supports everything you selected and may be a better fit if you want one plan for all of it.`,
      );
    }
  }

  return { warnings, unsupportedFeatures };
}
