import { describe, expect, it } from "vitest";
import { validateAnswers } from "./validation";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import type { QuestionnaireAnswers } from "@/types/questionnaire";

function answers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    filingType: "personal",
    incomeSources: ["salaryIncome"],
    deductions: [],
    helpPreference: "self",
    companyHadRevenue: null,
    ...overrides,
  };
}

describe("validation", () => {
  it("flags a missing filing type", () => {
    const errors = validateAnswers(answers({ filingType: null }));
    expect(errors.some((e) => e.field === "filingType")).toBe(true);
  });

  it("requires an income source for personal filings", () => {
    const errors = validateAnswers(answers({ incomeSources: [] }));
    expect(errors.some((e) => e.field === "incomeSources")).toBe(true);
  });

  it("requires the revenue answer for an incorporated company", () => {
    const errors = validateAnswers(
      answers({ filingType: "incorporated", companyHadRevenue: null }),
    );
    expect(errors.some((e) => e.field === "companyHadRevenue")).toBe(true);
  });

  it("does not force an income source on an incorporated company", () => {
    const errors = validateAnswers(
      answers({ filingType: "incorporated", incomeSources: [], companyHadRevenue: true }),
    );
    expect(errors.some((e) => e.field === "incomeSources")).toBe(false);
  });
});

describe("schema boundary validation (Bug 3.3)", () => {
  it("rejects garbage income sources such as 'freeMoney'", () => {
    const parsed = questionnaireAnswersSchema.safeParse({
      filingType: "personal",
      incomeSources: ["freeMoney"],
      deductions: [],
      helpPreference: "self",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts valid inputs and applies defaults", () => {
    const parsed = questionnaireAnswersSchema.safeParse({
      filingType: "personal",
      incomeSources: ["salaryIncome"],
      deductions: ["medicalExpenses"],
      helpPreference: "self",
    });
    expect(parsed.success).toBe(true);
  });
});
