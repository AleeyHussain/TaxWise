import "server-only";

import { products } from "@/features/products/catalogue";
import { DISCLAIMER } from "@/lib/constants";
import type { AssistantResponse, Confidence } from "@/types";
import { buildGroundingContext } from "./grounding";
import { containsUnsafeClaim } from "./safety";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function asConfidence(value: unknown): Confidence {
  return value === "low" || value === "medium" || value === "high" ? value : "medium";
}

function normalizeProductName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = products.find(
    (p) => p.name.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ? match.name : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

export async function askGroq(question: string): Promise<AssistantResponse> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let data: any;
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildGroundingContext() },
          { role: "user", content: question },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Groq request failed (${res.status}): ${body.slice(0, 200)}`);
    }
    data = await res.json();
  } finally {
    clearTimeout(timeout);
  }

  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Groq returned an empty response");
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq returned invalid JSON");
  }

  const answer = typeof parsed.answer === "string" ? parsed.answer : "";
  const reasons = asStringArray(parsed.reasons);

  if (!answer || containsUnsafeClaim([answer, ...reasons].join(" "))) {
    throw new Error("Groq response failed the safety check");
  }

  return {
    answer,
    recommendedProduct: normalizeProductName(parsed.recommendedProduct),
    confidence: asConfidence(parsed.confidence),
    reasons,
    disclaimer: DISCLAIMER,
    source: "ai",
  };
}
