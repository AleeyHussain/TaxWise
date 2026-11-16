import { DISCLAIMER } from "@/lib/constants";
import type { AssistantResponse } from "@/types/assistant";

export const SAFE_FALLBACK =
  "I cannot guarantee refunds or tax outcomes, and I cannot give tax, legal or financial advice. I can only offer general product guidance based on the product rules. For anything specific to your situation, please consult a qualified tax professional.";

export function screenUnsafe(question: string): AssistantResponse | null {
  const q = question.toLowerCase();

  const outcomeNearCertainty =
    /\b(definitely|certain|certainly|for sure)\b(?:\W+\w+){0,6}\W+\b(refund|outcome|result|approv(?:e|ed|al)?|accept(?:ed)?|qualif(?:y|ied)?|money back|owe)\b/.test(q);
  const directGuarantee = /\b(guarantee|guaranteed|promise|100%)\b/.test(q);
  const asksForRefundDirectly =
    /(will|can|do) i (definitely |still |even )?get (a |my )?(refund|money back)/.test(q);

  const asksForGuarantee = outcomeNearCertainty || directGuarantee || asksForRefundDirectly;

  const asksWillAccept =
    /(will|does|can|is|are)\b/.test(q) &&
    /\b(accept|approve)\b/.test(q) &&
    /\b(cra|tax authority|tax office|government|irs|revenue canada|revenue agency|hmrc|ato)\b/.test(q);

  const asksForAdvice =
    /(tax|legal|financial|accounting|professional) advice/.test(q) ||
    /is this (real )?advice/.test(q);

  if (asksForGuarantee || asksWillAccept || asksForAdvice) {
    return {
      answer: SAFE_FALLBACK,
      recommendedProduct: null,
      confidence: "low",
      reasons: [
        "Refunds and tax outcomes depend on your full situation and on the tax authority.",
        "This assistant only maps your situation to the available products.",
      ],
      disclaimer: DISCLAIMER,
      source: "simulated",
    };
  }

  return null;
}

export function containsUnsafeClaim(text: string): boolean {
  const t = text.toLowerCase();
  return (
    (/\bguarantee/.test(t) && /(refund|outcome|return|result|deduct)/.test(t)) ||
    /you (are|will be) guaranteed/.test(t) ||
    /you definitely qualify/.test(t) ||
    /you (must|have to) use\b/.test(t) ||
    /\b(cra|tax authority|the government|irs|revenue canada|revenue agency|hmrc|ato)\b.{0,40}\b(accept|approve)/.test(t) ||
    /(will|shall) (definitely )?(accept|approve) your (return|filing)/.test(t) ||
    /this is (legal|professional tax|tax|financial|accounting) advice/.test(t)
  );
}
