import { describe, expect, it } from "vitest";
import { getProductById, products, requireProduct } from "./catalogue";

describe("products catalogue", () => {
  it("contains all 8 products", () => {
    expect(products.length).toBe(8);
  });

  it("retrieves a product by id", () => {
    const free = getProductById("free");
    expect(free).toBeDefined();
    expect(free?.name).toBe("Free");
  });

  it("requireProduct returns the product or throws for unknown id", () => {
    expect(requireProduct("deluxe").name).toBe("Deluxe");
    expect(() => requireProduct("non-existent")).toThrow("Unknown product id");
  });
});
