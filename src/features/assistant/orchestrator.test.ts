import { describe, expect, it } from "vitest";
import { orchestrateAssistant } from "./orchestrator";

describe("assistant orchestrator", () => {
  it("routes unsafe questions to the safe fallback", async () => {
    const res = await orchestrateAssistant("Will you guarantee a tax refund?");
    expect(res.recommendedProduct).toBeNull();
    expect(res.answer).toMatch(/cannot guarantee/i);
    expect(res.source).toBe("simulated");
  });

  it("routes regular questions to simulated answer when GROQ_API_KEY is unset", async () => {
    const res = await orchestrateAssistant("I have salary income and donations. Which product should I use?");
    expect(res.recommendedProduct).toBe("Deluxe");
    expect(res.source).toBe("simulated");
  });
});
