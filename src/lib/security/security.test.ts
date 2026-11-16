import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rate-limit";
import { isValidOrigin } from "./csrf";
import { createSessionToken, verifySessionToken } from "../auth/session";

describe("rate limiting", () => {
  it("enforces max requests within window", () => {
    const key = "test-rate-limit-ip";
    resetRateLimit(key);
    const config = { windowMs: 60000, maxRequests: 3 };

    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(true);
    expect(checkRateLimit(key, config).allowed).toBe(false);
  });
});

describe("csrf / origin validation", () => {
  it("allows matching origin and host", () => {
    const req = new Request("http://localhost:3000/api/recommend", {
      headers: {
        origin: "http://localhost:3000",
        host: "localhost:3000",
      },
    });
    expect(isValidOrigin(req)).toBe(true);
  });

  it("blocks mismatched origin", () => {
    const req = new Request("http://localhost:3000/api/recommend", {
      headers: {
        origin: "http://attacker.com",
        host: "localhost:3000",
      },
    });
    expect(isValidOrigin(req)).toBe(false);
  });
});

describe("session tokens", () => {
  it("creates and verifies signed session tokens", async () => {
    const token = await createSessionToken("testadmin");
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.username).toBe("testadmin");
  });

  it("rejects tampered session tokens", async () => {
    const token = await createSessionToken("testadmin");
    const tampered = token.slice(0, -4) + "abcd";
    const verified = await verifySessionToken(tampered);
    expect(verified).toBeNull();
  });
});
