import { FEATURE_LABELS, getProductById, products } from "@/data/products";
import { DISCLAIMER, recommend } from "@/lib/recommend";
import type {
  AssistantResponse,
  Deduction,
  FeatureKey,
  FilingType,
  HelpPreference,
  IncomeSource,
  Product,
  QuestionnaireAnswers,
} from "@/lib/types";

// The line the assistant always falls back on for tax/legal/financial questions
// and for anyone fishing for a guaranteed outcome.
const SAFE_FALLBACK =
  "I cannot guarantee refunds or tax outcomes, and I cannot give tax, legal or financial advice. I can only offer general product guidance based on the product rules. For anything specific to your situation, please consult a qualified tax professional.";

function formatPrice(price: number): string {
  return price === 0 ? "is free" : `costs CAD $${price}`;
}

// ---- Safety screen --------------------------------------------------------

// Catch the questions section 12 says we must not answer with a hard claim.
// Returns a safe response when the question is asking for a guarantee or for
// real tax/legal/financial advice, otherwise null so the normal flow runs.
export function screenUnsafe(question: string): AssistantResponse | null {
  const q = question.toLowerCase();

  // Section 12 forbids the assistant from promising a refund AND from telling
  // someone they "definitely qualify", so we look for certainty wording, not
  // just the literal word "guarantee".
  const certainty = /\b(guarantee|guaranteed|definitely|certain|certainly|for sure|promise|100%)\b/.test(q);
  const outcomeWord = /(refund|outcome|result|approv|accept|qualif|deduct|money back|owe)/.test(q);
  const asksForGuarantee =
    (certainty && outcomeWord) ||
    /(will|can|do) i (definitely |still |even )?get (a |my )?(refund|money back)/.test(q);

  // Asking whether a tax authority will accept or approve the return. Covers the
  // common informal authority names too.
  const asksWillAccept =
    /(will|does|can|is|are)\b/.test(q) &&
    /(accept|approve)/.test(q) &&
    /(cra|tax authority|tax office|government|irs|revenue canada|revenue agency|hmrc|ato)/.test(q);

  // Asking for, or to confirm, real tax/legal/financial/professional advice.
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

// A last line of defence used on model output too: if a reply slips through
// with a guaranteed claim, we treat it as unsafe.
export function containsUnsafeClaim(text: string): boolean {
  const t = text.toLowerCase();
  return (
    (/\bguarantee/.test(t) && /(refund|outcome|return|result|deduct)/.test(t)) ||
    /you (are|will be) guaranteed/.test(t) ||
    /you definitely qualify/.test(t) ||
    /you (must|have to) use\b/.test(t) ||
    /(cra|tax authority|the government|irs|revenue canada|hmrc|ato).{0,40}(accept|approve)/.test(t) ||
    /(will|shall) (definitely )?(accept|approve) your (return|filing)/.test(t) ||
    /this is (legal|professional tax|tax|financial|accounting) advice/.test(t)
  );
}

// ---- Natural-language parsing for the simulated assistant -----------------

interface ParsedSignals {
  answers: QuestionnaireAnswers;
  neededFeatures: FeatureKey[];
  mentionedProducts: Product[];
}

function detectFilingType(q: string): FilingType {
  if (/incorporat|corporation|\bcorp\b/.test(q) || (/\bcompany\b/.test(q) && /(revenue|nil|incorporat)/.test(q))) {
    return "incorporated";
  }
  if (/freelanc|self[- ]employ|contractor|sole propriet|\bgig\b/.test(q)) {
    return "self_employed";
  }
  return "personal";
}

function detectHelp(q: string): HelpPreference {
  if (/(file|do|handle|prepare).{0,20}(for me)|someone else to file|full service|hand (it|everything) over|expert to file/.test(q)) {
    return "expert_file";
  }
  if (/expert help|help while|need help|expert review|review before|talk to (an|a) expert|expert assist|help from (an|a) expert/.test(q)) {
    return "expert_help";
  }
  return "self";
}

function detectIncome(q: string): IncomeSource[] {
  const found: IncomeSource[] = [];
  if (/salary|wages|\bt4\b/.test(q)) found.push("salaryIncome");
  if (/student|tuition|scholarship/.test(q)) found.push("studentIncome");
  if (/investment|stocks|dividend|portfolio|\betf\b/.test(q)) found.push("investmentIncome");
  if (/capital gain/.test(q)) found.push("capitalGains");
  if (/rental|rent out|tenant|landlord|investment property/.test(q)) found.push("rentalIncome");
  if (/freelance/.test(q)) found.push("freelanceIncome");
  if (/\bgig\b|uber|rideshare|doordash|delivery/.test(q)) found.push("gigWorkIncome");
  if (/business revenue|business income|sales revenue/.test(q)) found.push("businessRevenue");
  if (/foreign|overseas|abroad/.test(q)) found.push("foreignIncome");
  return found;
}

function detectDeductions(q: string): Deduction[] {
  const found: Deduction[] = [];
  if (/medical|prescription|dental/.test(q)) found.push("medicalExpenses");
  if (/donation|charit|donate/.test(q)) found.push("donations");
  if (/employment expense|union dues/.test(q)) found.push("employmentExpenses");
  if (/home[- ]office|work from home/.test(q)) found.push("homeOfficeExpenses");
  if (/vehicle|mileage|car expense/.test(q)) found.push("vehicleExpenses");
  if (/business expense|supplies|equipment/.test(q)) found.push("businessExpenses");
  return found;
}

function detectRevenue(q: string): boolean | null {
  if (/no revenue|without revenue|\bnil\b|zero revenue|no income|had no revenue/.test(q)) return false;
  if (/had revenue|with revenue|made (money|sales)|earned revenue|company.*revenue/.test(q)) return true;
  return null;
}

// Which product feature flags the user's situation needs. Used to answer
// "can I use product X" style questions against real product data.
function neededFeaturesFrom(answers: QuestionnaireAnswers): FeatureKey[] {
  const needs = new Set<FeatureKey>();
  const incomeToFeature: Partial<Record<IncomeSource, FeatureKey>> = {
    salaryIncome: "salaryIncome",
    studentIncome: "studentIncome",
    investmentIncome: "investmentIncome",
    capitalGains: "capitalGains",
    rentalIncome: "rentalIncome",
    freelanceIncome: "freelanceIncome",
    gigWorkIncome: "gigWorkIncome",
    businessRevenue: "freelanceIncome",
    foreignIncome: "foreignIncome",
  };
  const deductionToFeature: Partial<Record<Deduction, FeatureKey>> = {
    medicalExpenses: "medicalExpenses",
    donations: "donations",
    employmentExpenses: "employmentExpenses",
    homeOfficeExpenses: "homeOfficeExpenses",
    vehicleExpenses: "vehicleExpenses",
    businessExpenses: "businessExpenses",
  };
  for (const s of answers.incomeSources) {
    const f = incomeToFeature[s];
    if (f) needs.add(f);
  }
  for (const d of answers.deductions) {
    const f = deductionToFeature[d];
    if (f) needs.add(f);
  }
  if (answers.helpPreference === "expert_help") needs.add("expertHelp");
  if (answers.helpPreference === "expert_file") needs.add("fullService");
  return Array.from(needs);
}

function findMentionedProducts(q: string): Product[] {
  const matches: Product[] = [];
  const test = (id: string, re: RegExp) => {
    if (re.test(q)) {
      const p = getProductById(id);
      if (p && !matches.includes(p)) matches.push(p);
    }
  };
  // Order matters: match the more specific names first.
  test("expert-full-service", /expert full service|full service/);
  test("expert-assist", /expert assist/);
  test("nil-corporate-return", /nil corporate|nil return/);
  test("business-corporate", /business corporate/);
  test("self-employed", /self[- ]employed/);
  test("premier", /\bpremier\b/);
  test("deluxe", /\bdeluxe\b/);
  test("free", /\bfree\b/);
  return matches;
}

function parseSignals(question: string): ParsedSignals {
  const q = question.toLowerCase();
  const filingType = detectFilingType(q);
  const answers: QuestionnaireAnswers = {
    filingType,
    incomeSources: detectIncome(q),
    deductions: detectDeductions(q),
    helpPreference: detectHelp(q),
    companyHadRevenue: filingType === "incorporated" ? detectRevenue(q) : null,
  };
  return {
    answers,
    neededFeatures: neededFeaturesFrom(answers),
    mentionedProducts: findMentionedProducts(q),
  };
}

// ---- The simulated assistant ----------------------------------------------

// Answer "what is the difference between A and B" using real product data.
function differenceAnswer(a: Product, b: Product): AssistantResponse {
  const onlyA: string[] = [];
  const onlyB: string[] = [];
  (Object.keys(FEATURE_LABELS) as FeatureKey[]).forEach((key) => {
    if (a.supports[key] && !b.supports[key]) onlyA.push(FEATURE_LABELS[key].toLowerCase());
    if (b.supports[key] && !a.supports[key]) onlyB.push(FEATURE_LABELS[key].toLowerCase());
  });

  const reasons: string[] = [
    `${a.name} ${formatPrice(a.price)}. ${b.name} ${formatPrice(b.price)}.`,
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

// Answer "can I use product X for my situation".
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
        `${target.name} ${formatPrice(target.price)}.`,
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
  const priceText = product ? ` ${product.name} ${formatPrice(product.price)}.` : "";

  return {
    answer: `Based on the product rules, ${rec.recommendedProductName} looks like the best fit.${priceText} ${rec.reasons.join(" ")}`,
    recommendedProduct: rec.recommendedProductName,
    confidence: rec.confidence,
    reasons: rec.reasons,
    disclaimer: DISCLAIMER,
    source: "simulated",
  };
}

// ---- Grounding context for the real model ---------------------------------

// Build a compact catalogue + rules + safety brief from the live product data,
// so the model answers from the same source of truth as the rest of the app.
export function buildGroundingContext(): string {
  const catalogue = products
    .map((p) => {
      const supported = (Object.keys(p.supports) as FeatureKey[])
        .filter((k) => p.supports[k])
        .map((k) => FEATURE_LABELS[k])
        .join(", ");
      return [
        `- ${p.name} (id: ${p.id}, ${p.price === 0 ? "free" : `CAD $${p.price}`}, category: ${p.category})`,
        `  best for: ${p.bestFor}`,
        `  supports: ${supported || "none of the tracked features"}`,
        `  does not support: ${p.notSupported.join(", ")}`,
      ].join("\n");
    })
    .join("\n");

  return `You are the product-selection assistant for TaxWise, a fictional tax software company.
Your only job is to help a visitor pick one of the products below based on what they describe.

PRODUCTS:
${catalogue}

RECOMMENDATION RULES (apply in this priority order, highest wins):
1. Incorporated company -> Business Corporate. If the company had no revenue -> Nil Corporate Return. This overrides every personal product.
2. Wants an expert to file for them -> Expert Full Service (unless incorporated).
3. Wants expert help while filing -> Expert Assist (unless incorporated).
4. Freelance, gig-work, business revenue, business expenses, home-office or vehicle expenses -> Self-Employed.
5. Investment income, capital gains, rental income or foreign income -> Premier.
6. Medical expenses, donations or employment expenses -> Deluxe.
7. Simple salary or student return with nothing extra -> Free.

SAFETY RULES (follow strictly):
- Never promise a refund or any tax outcome. Never say someone is guaranteed anything.
- Never say a return will be accepted or approved by a tax authority.
- Never give tax, legal, financial or accounting advice, and never call your answer such advice.
- Never invent a feature a product does not have. Only use the supports lists above.
- Prefer wording like "based on the product rules" and "this product appears suitable".
- If asked for a guarantee or for real tax/legal advice, decline politely and give general product guidance instead.
- Always include the disclaimer.

OUTPUT FORMAT:
Reply with a single JSON object and nothing else, using exactly these keys:
{
  "answer": string,
  "recommendedProduct": string | null,   // an exact product name from the list, or null
  "confidence": "low" | "medium" | "high",
  "reasons": string[],
  "disclaimer": string
}
The disclaimer must be: "${DISCLAIMER}"`;
}
