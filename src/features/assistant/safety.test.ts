import { describe, expect, it } from "vitest";
import { containsUnsafeClaim, screenUnsafe } from "./safety";

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

  it("does not false-positive on 'certain' with medical deductions (Bug 3.8)", () => {
    expect(screenUnsafe("I'm certain about my medical deductions, which plan?")).toBeNull();
  });

  it("flags forbidden claims in model output", () => {
    expect(containsUnsafeClaim("You are guaranteed a refund.")).toBe(true);
    expect(containsUnsafeClaim("The tax authority will accept your return.")).toBe(true);
    expect(containsUnsafeClaim("You must use Premier.")).toBe(true);
    expect(containsUnsafeClaim("This is professional tax advice.")).toBe(true);
    expect(containsUnsafeClaim("Premier appears suitable for rental income.")).toBe(false);
  });

  it("does not match plain words containing authority substrings (Bug 3.4)", () => {
    expect(containsUnsafeClaim("First, the information you need is here.")).toBe(false);
    expect(containsUnsafeClaim("Craft your return carefully.")).toBe(false);
  });
});
