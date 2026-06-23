import { describe, expect, it } from "vitest";
import { containsUnsafeClaim, screenUnsafe, simulatedAnswer } from "@/lib/assistant";

describe("assistant safety", () => {
  it("refuses to guarantee a refund", () => {
    const r = screenUnsafe("Can you guarantee I will get a refund?");
    expect(r).not.toBeNull();
    expect(r?.recommendedProduct).toBeNull();
    expect(r?.answer.toLowerCase()).toMatch(/cannot guarantee/);
    expect(r?.disclaimer).toMatch(/not tax, legal, or financial advice/i);
  });

  it("refuses to confirm a deduction qualification", () => {
    expect(screenUnsafe("Will I definitely qualify for this deduction?")).not.toBeNull();
    expect(screenUnsafe("Am I definitely going to qualify for the medical deduction?")).not.toBeNull();
  });

  it("refuses to predict that a tax authority will accept the return", () => {
    expect(screenUnsafe("Will the CRA accept my return?")).not.toBeNull();
    expect(screenUnsafe("Will Revenue Canada accept my return?")).not.toBeNull();
  });

  it("refuses a plain refund prediction", () => {
    expect(screenUnsafe("Will I get a refund?")).not.toBeNull();
  });

  it("does not give legal or professional tax advice", () => {
    expect(screenUnsafe("Is this legal advice I can rely on?")).not.toBeNull();
    expect(screenUnsafe("Is this professional tax advice?")).not.toBeNull();
  });

  it("lets a normal product question through", () => {
    expect(screenUnsafe("Which plan is best for rental income?")).toBeNull();
    expect(screenUnsafe("Can I claim home-office expenses with Self-Employed?")).toBeNull();
  });

  it("flags forbidden claims in model output", () => {
    expect(containsUnsafeClaim("You are guaranteed a refund.")).toBe(true);
    expect(containsUnsafeClaim("The tax authority will accept your return.")).toBe(true);
    expect(containsUnsafeClaim("You must use Premier.")).toBe(true);
    expect(containsUnsafeClaim("This is professional tax advice.")).toBe(true);
    expect(containsUnsafeClaim("Premier appears suitable for rental income.")).toBe(false);
  });
});

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
