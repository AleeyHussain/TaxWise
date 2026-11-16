import { describe, expect, it } from "vitest";
import { buildGroundingContext } from "./grounding";

describe("assistant grounding", () => {
  it("builds context containing products and rules", () => {
    const context = buildGroundingContext();
    expect(context).toContain("TaxWise");
    expect(context).toContain("Free");
    expect(context).toContain("Deluxe");
    expect(context).toContain("Premier");
    expect(context).toContain("Self-Employed");
    expect(context).toContain("Expert Assist");
    expect(context).toContain("Expert Full Service");
    expect(context).toContain("Business Corporate");
    expect(context).toContain("Nil Corporate Return");
    expect(context).toContain("RECOMMENDATION RULES");
    expect(context).toContain("SAFETY RULES");
  });
});
