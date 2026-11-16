import type { QuestionnaireAnswers } from "@/types/questionnaire";

export function buildWarnings(answers: QuestionnaireAnswers): string[] {
  const warnings: string[] = [];
  const deductions = new Set(answers.deductions);

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

  return warnings;
}
