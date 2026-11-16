import { describe, it, expect } from "vitest";
import { searchableText, CATEGORY_OPTIONS } from "./search";
import { products } from "./catalogue";

describe("products search module", () => {
  it("provides valid category options", () => {
    expect(CATEGORY_OPTIONS.length).toBeGreaterThan(0);
    expect(CATEGORY_OPTIONS.some((opt) => opt.value === "all")).toBe(true);
    expect(CATEGORY_OPTIONS.some((opt) => opt.value === "personal")).toBe(true);
  });

  it("produces searchable text containing plan name, highlights and supported features", () => {
    const text0 = searchableText(0);
    const prod0 = products[0];
    expect(text0).toContain(prod0.name.toLowerCase());
    expect(text0).toContain(prod0.bestFor.toLowerCase());
  });
});
