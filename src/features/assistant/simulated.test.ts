import { describe, expect, it } from "vitest";
import { simulatedAnswer } from "./simulated";
import { detectRevenue, neededFeaturesFrom } from "./signals";

describe("simulated assistant grounding", () => {
  it("maps salary and donations to Deluxe", () => {
    const r = simulatedAnswer("I have salary income and donations. Which product should I use?");
    expect(r.recommendedProduct).toBe("Deluxe");
  });

  it("maps investment and rental income to Premier", () => {
    const r = simulatedAnswer("I have investment income and rental income. Which product fits me?");
    expect(r.recommendedProduct).toBe("Premier");
  });

  it("tells a freelancer with home-office costs that Free will not cover them", () => {
    const r = simulatedAnswer("I am a freelancer with home-office expenses. Can I use Free?");
    expect(r.answer.toLowerCase()).toMatch(/does not cover|self-employed/);
    expect(r.recommendedProduct).not.toBe("Free");
  });

  it("points a no-revenue incorporated company at the Nil return", () => {
    const r = simulatedAnswer("I own an incorporated company with no revenue. What should I choose?");
    expect(r.recommendedProduct).toBe("Nil Corporate Return");
  });

  it("explains the difference between two named products", () => {
    const r = simulatedAnswer("What is the difference between Premier and Self-Employed?");
    expect(r.answer.toLowerCase()).toMatch(/premier/);
    expect(r.answer.toLowerCase()).toMatch(/self-employed/);
  });

  it("always includes a disclaimer", () => {
    const r = simulatedAnswer("I want someone else to file for me. What should I select?");
    expect(r.recommendedProduct).toBe("Expert Full Service");
    expect(r.disclaimer).toMatch(/not tax, legal, or financial advice/i);
  });
});

describe("logic bug regressions", () => {
  it("corporate case adds corporateFiling / nilCorporateReturn in neededFeaturesFrom (Bug 3.5)", () => {
    const withRevenue = neededFeaturesFrom({
      filingType: "incorporated",
      companyHadRevenue: true,
      incomeSources: [],
      deductions: [],
      helpPreference: "self",
    });
    expect(withRevenue).toContain("corporateFiling");

    const noRevenue = neededFeaturesFrom({
      filingType: "incorporated",
      companyHadRevenue: false,
      incomeSources: [],
      deductions: [],
      helpPreference: "self",
    });
    expect(noRevenue).toContain("nilCorporateReturn");

    const r = simulatedAnswer("I'm incorporated, can I use Free?");
    expect(r.recommendedProduct).not.toBe("Free");
    expect(r.answer.toLowerCase()).toMatch(/does not cover/);
  });

  it("mentions business revenue instead of freelance income (Bug 3.6)", () => {
    const r = simulatedAnswer("I have business revenue, can I use Free?");
    expect(r.answer.toLowerCase()).toMatch(/business revenue/);
    expect(r.answer.toLowerCase()).not.toMatch(/freelance income/);
  });

  it("detectRevenue correctly recognizes negations (Bug 3.7)", () => {
    expect(detectRevenue("We didn't have any revenue this year")).toBe(false);
    expect(detectRevenue("There wasn't any revenue")).toBe(false);
    expect(detectRevenue("We haven't made money")).toBe(false);
    expect(detectRevenue("We have not had revenue")).toBe(false);
    expect(detectRevenue("We had revenue of $50,000")).toBe(true);
  });

  it("returns off-topic fallback for questions without plans or signals (Bug 3.9)", () => {
    const r1 = simulatedAnswer("Is TurboTax better than Free?");
    expect(r1.recommendedProduct).toBeNull();
    expect(r1.confidence).toBe("low");
    expect(r1.answer).toMatch(/only help with the plans on TaxWise/i);

    const r2 = simulatedAnswer("What is the weather today?");
    expect(r2.recommendedProduct).toBeNull();
    expect(r2.confidence).toBe("low");
    expect(r2.answer).toMatch(/only help with the plans on TaxWise/i);
  });
});
