import { describe, expect, it } from "vitest";
import { recommend } from "./engine";
import { buildWarnings } from "./warnings";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
} from "@/types";

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

describe("priority shadowing (Bug 3.1 & 3.2)", () => {
  it("freelanceIncome + capitalGains -> Self-Employed with warning and Expert Assist upgrade", () => {
    const r = recommend(
      answers({ incomeSources: ["freelanceIncome", "capitalGains"] }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.warnings?.some((w) => w.includes("does not cover capital gains"))).toBe(true);
    expect(r.optionalUpgrade?.productId).toBe("expert-assist");
  });

  it("freelanceIncome + foreignIncome -> Self-Employed with warning and Expert Assist upgrade", () => {
    const r = recommend(
      answers({ incomeSources: ["freelanceIncome", "foreignIncome"] }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.warnings?.some((w) => w.includes("does not cover foreign income"))).toBe(true);
    expect(r.optionalUpgrade?.productId).toBe("expert-assist");
  });

  it("freelanceIncome + employmentExpenses -> Self-Employed with warning and Expert Assist upgrade", () => {
    const r = recommend(
      answers({
        incomeSources: ["freelanceIncome"],
        deductions: ["employmentExpenses"],
      }),
    );
    expect(r.recommendedProductId).toBe("self-employed");
    expect(r.warnings?.some((w) => w.includes("does not cover employment expenses"))).toBe(true);
    expect(r.optionalUpgrade?.productId).toBe("expert-assist");
  });

  it("buildWarnings does not throw when incomeSources is undefined (Bug 3.2)", () => {
    expect(() =>
      buildWarnings({
        filingType: "incorporated",
        incomeSources: undefined as unknown as IncomeSource[],
        deductions: [],
        helpPreference: "self",
        companyHadRevenue: true,
      }),
    ).not.toThrow();
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
