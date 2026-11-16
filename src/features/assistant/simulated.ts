import { FEATURE_LABELS } from "@/features/products/feature-labels";
import { getProductById } from "@/features/products/catalogue";
import { formatPrice } from "@/lib/format";
import { DISCLAIMER } from "@/lib/constants";
import { recommend } from "@/features/recommend/engine";
import type { AssistantResponse, FeatureKey, Product } from "@/types";
import { screenUnsafe } from "./safety";
import { parseSignals, type ParsedSignals } from "./signals";

export * from "./signals";

function formatAssistantPrice(price: number): string {
  return price === 0 ? "is free" : `costs CAD $${price}`;
}

function differenceAnswer(a: Product, b: Product): AssistantResponse {
  const onlyA: string[] = [];
  const onlyB: string[] = [];
  (Object.keys(FEATURE_LABELS) as FeatureKey[]).forEach((key) => {
    if (a.supports[key] && !b.supports[key]) onlyA.push(FEATURE_LABELS[key].toLowerCase());
    if (b.supports[key] && !a.supports[key]) onlyB.push(FEATURE_LABELS[key].toLowerCase());
  });

  const reasons: string[] = [
    `${a.name} ${formatAssistantPrice(a.price)}. ${b.name} ${formatAssistantPrice(b.price)}.`,
  ];
  if (onlyA.length > 0) reasons.push(`${a.name} adds ${onlyA.join(", ")}.`);
  if (onlyB.length > 0) reasons.push(`${b.name} adds ${onlyB.join(", ")}.`);
  if (onlyA.length === 0 && onlyB.length === 0) {
    reasons.push("On the tracked features they cover the same ground; the main difference is price.");
  }

  return {
    answer: `Here is how ${a.name} and ${b.name} compare based on the product rules. ${reasons.join(" ")}`,
    recommendedProduct: null,
    confidence: "medium",
    reasons,
    disclaimer: DISCLAIMER,
    source: "simulated",
  };
}

function canUseAnswer(target: Product, signals: ParsedSignals): AssistantResponse {
  const missing = signals.neededFeatures.filter((f) => !target.supports[f]);
  const rec = recommend(signals.answers);

  if (missing.length === 0) {
    const covered = signals.neededFeatures.map((f) => FEATURE_LABELS[f].toLowerCase());
    const coveredText =
      covered.length > 0 ? ` It supports ${covered.join(", ")}.` : "";
    return {
      answer: `Based on the product rules, ${target.name} can work for what you described.${coveredText}`,
      recommendedProduct: target.name,
      confidence: "medium",
      reasons: [
        `${target.name} ${formatAssistantPrice(target.price)}.`,
        covered.length > 0
          ? `It covers ${covered.join(", ")}.`
          : "Nothing you mentioned falls outside what it supports.",
      ],
      disclaimer: DISCLAIMER,
      source: "simulated",
    };
  }

  const missingText = missing.map((f) => FEATURE_LABELS[f].toLowerCase()).join(", ");
  return {
    answer: `Based on the product rules, ${target.name} does not cover ${missingText}. ${rec.recommendedProductName} looks like a better fit because it supports more of what you described.`,
    recommendedProduct: rec.recommendedProductName,
    confidence: rec.confidence,
    reasons: [
      `${target.name} does not support ${missingText}.`,
      ...rec.reasons,
    ],
    disclaimer: DISCLAIMER,
    source: "simulated",
  };
}

export function simulatedAnswer(question: string): AssistantResponse {
  const unsafe = screenUnsafe(question);
  if (unsafe) return unsafe;

  const q = question.toLowerCase();
  const signals = parseSignals(question);

  // Bug 3.9: off-topic / competitor check
  const isCompetitorMention = /\bturbotax\b|h&r block|ufile|wealthsimple tax/.test(q);
  const hasNoTaxSignals =
    signals.answers.incomeSources.length === 0 &&
    signals.answers.deductions.length === 0 &&
    signals.answers.helpPreference === "self" &&
    signals.answers.companyHadRevenue === null;

  if (
    (signals.mentionedProducts.length === 0 && hasNoTaxSignals) ||
    (isCompetitorMention && hasNoTaxSignals)
  ) {
    return {
      answer:
        "I can only help with the plans on TaxWise. Could you tell me about your income, deductions, or which plan you're considering?",
      recommendedProduct: null,
      confidence: "low",
      reasons: ["I can only help with the plans on TaxWise."],
      disclaimer: DISCLAIMER,
      source: "simulated",
    };
  }

  // "Difference between A and B"
  if (/difference|compare|versus|\bvs\b/.test(q) && signals.mentionedProducts.length >= 2) {
    return differenceAnswer(signals.mentionedProducts[0], signals.mentionedProducts[1]);
  }

  // "Can I use <product>?"
  if (/can i use|should i use|is .* (enough|ok|fine)|will .* work/.test(q) && signals.mentionedProducts.length >= 1) {
    return canUseAnswer(signals.mentionedProducts[0], signals);
  }

  // Default: run the engine on the parsed situation.
  const rec = recommend(signals.answers);
  const product = getProductById(rec.recommendedProductId);
  const priceText = product ? ` ${product.name} ${formatAssistantPrice(product.price)}.` : "";

  return {
    answer: `Based on the product rules, ${rec.recommendedProductName} looks like the best fit.${priceText} ${rec.reasons.join(" ")}`,
    recommendedProduct: rec.recommendedProductName,
    confidence: rec.confidence,
    reasons: rec.reasons,
    disclaimer: DISCLAIMER,
    source: "simulated",
  };
}
