import { describe, expect, it } from "vitest";
import { recommend, validateAnswers } from "@/lib/recommend";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
} from "@/lib/types";

// Small builder so each test only states what it cares about.
function answers(overrides: Partial<QuestionnaireAnswers> = {}): QuestionnaireAnswers {
  return {
    filingType: "personal" as FilingType,
    incomeSources: [] as IncomeSource[],
    deductions: [] as Deduction[],
    helpPreference: "self" as HelpPreference,
    companyHadRevenue: null,
    ...overrides,
  };
}

describe("recommendation engine - the scenarios from the brief", () => {
  it("salary only -> Free", () => {
    const r = recommend(answers({ incomeSources: ["salaryIncome"] }));
    expect(r.recommendedProductId).toBe("free");
  });

  it("salary + donations -> Deluxe", () => {
    const r = recommend(
      answers({ incomeSources: ["salaryIncome"], deductions: ["donations"] }),
    );
    expect(r.recommendedProductId).toBe("deluxe");
  });

  it("investment income -> Premier", () => {
    const r = recommend(answers({ incomeSources: ["investmentIncome"] }));
    expect(r.recommendedProductId).toBe("premier");
  });

  it("rental income -> Premier", () => {
    const r = recommend(answers({ incomeSources: ["rentalIncome"] }));
    expect(r.recommendedProductId).toBe("premier");
  });

  it("freelance income -> Self-Employed", () => {
    const r = recommend(answers({ incomeSources: ["freelanceIncome"] }));
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("home-office expenses -> Self-Employed", () => {
    const r = recommend(
      answers({ incomeSources: ["salaryIncome"], deductions: ["homeOfficeExpenses"] }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("wants expert help -> Expert Assist", () => {
    const r = recommend(
      answers({ incomeSources: ["salaryIncome"], helpPreference: "expert_help" }),
    );
    expect(r.recommendedProductId).toBe("expert-assist");
  });

  it("wants an expert to file -> Expert Full Service", () => {
    const r = recommend(
      answers({ incomeSources: ["salaryIncome"], helpPreference: "expert_file" }),
    );
    expect(r.recommendedProductId).toBe("expert-full-service");
  });

  it("incorporated company with revenue -> Business Corporate", () => {
    const r = recommend(
      answers({ filingType: "incorporated", companyHadRevenue: true }),
    );
    expect(r.recommendedProductId).toBe("business-corporate");
  });

  it("incorporated company with no revenue -> Nil Corporate Return", () => {
    const r = recommend(
      answers({ filingType: "incorporated", companyHadRevenue: false }),
    );
    expect(r.recommendedProductId).toBe("nil-corporate-return");
  });
});

describe("priority ordering", () => {
  it("incorporated overrides an expert-file request", () => {
    const r = recommend(
      answers({
        filingType: "incorporated",
        companyHadRevenue: true,
        helpPreference: "expert_file",
      }),
    );
    expect(r.recommendedProductId).toBe("business-corporate");
  });

  it("expert-file outranks self-employment signals", () => {
    const r = recommend(
      answers({
        filingType: "self_employed",
        incomeSources: ["freelanceIncome"],
        helpPreference: "expert_file",
      }),
    );
    expect(r.recommendedProductId).toBe("expert-full-service");
  });

  it("self-employment outranks investment income", () => {
    const r = recommend(
      answers({ incomeSources: ["freelanceIncome", "investmentIncome"] }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
  });

  it("investment income outranks common deductions", () => {
    const r = recommend(
      answers({ incomeSources: ["investmentIncome"], deductions: ["donations"] }),
    );
    expect(r.recommendedProductId).toBe("premier");
  });

  it("a self-employed filing type alone -> Self-Employed", () => {
    const r = recommend(
      answers({ filingType: "self_employed", incomeSources: ["salaryIncome"] }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
  });
});

describe("result shape and edge cases", () => {
  it("always returns reasons and a disclaimer", () => {
    const r = recommend(answers({ incomeSources: ["salaryIncome"] }));
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.disclaimer).toMatch(/not tax, legal, or financial advice/i);
  });

  it("warns when 'no deductions' is mixed with a real deduction", () => {
    const r = recommend(
      answers({ incomeSources: ["salaryIncome"], deductions: ["none", "donations"] }),
    );
    expect(r.warnings?.some((w) => /no special deductions/i.test(w))).toBe(true);
  });

  it("matchedInputs reflects the triggering selections", () => {
    const r = recommend(
      answers({ incomeSources: ["freelanceIncome"], deductions: ["homeOfficeExpenses"] }),
    );
    expect(r.matchedInputs).toContain("freelanceIncome");
    expect(r.matchedInputs).toContain("homeOfficeExpenses");
  });
});

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
