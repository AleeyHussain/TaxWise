import { describe, expect, it } from "vitest";
import { simulatedAnswer } from "./simulated";

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
