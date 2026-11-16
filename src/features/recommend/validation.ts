import type { QuestionnaireAnswers, ValidationError } from "@/types/questionnaire";

export function validateAnswers(answers: QuestionnaireAnswers): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!answers.filingType) {
    errors.push({ field: "filingType", message: "Please choose what you are filing for." });
  }

  if (answers.filingType !== "incorporated") {
    if (!answers.incomeSources || answers.incomeSources.length === 0) {
      errors.push({
        field: "incomeSources",
        message: "Please select at least one income source.",
      });
    }
  }

  if (!answers.helpPreference) {
    errors.push({
      field: "helpPreference",
      message: "Please tell us how much help you want.",
    });
  }

  if (answers.filingType === "incorporated" && answers.companyHadRevenue === null) {
    errors.push({
      field: "companyHadRevenue",
      message: "Please tell us whether the company had revenue.",
    });
  }

  return errors;
}
