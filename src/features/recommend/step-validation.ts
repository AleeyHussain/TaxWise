import type { QuestionnaireAnswers } from "@/types";

export type WizardStepKey = "filing" | "income" | "deductions" | "help" | "revenue" | "result";

export function validateWizardStep(step: WizardStepKey, answers: QuestionnaireAnswers): string | null {
  switch (step) {
    case "filing":
      return answers.filingType ? null : "Please choose what you are filing for.";
    case "income":
      if (answers.filingType !== "incorporated" && (answers.incomeSources ?? []).length === 0) {
        return "Please select at least one income source.";
      }
      return null;
    case "help":
      return answers.helpPreference ? null : "Please tell us how much help you want.";
    case "revenue":
      return answers.companyHadRevenue === null
        ? "Please tell us whether the company had revenue."
        : null;
    default:
      return null;
  }
}
