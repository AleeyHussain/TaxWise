import { requireProduct } from "@/data/products";
import type {
  Confidence,
  OptionalUpgrade,
  QuestionnaireAnswers,
  RecommendationResult,
  ValidationError,
} from "@/lib/types";

export const DISCLAIMER =
  "This recommendation provides general product guidance only and is not tax, legal, or financial advice.";

// Plain-English label for a matched input token. Used to build the reason
// sentences so the result reads naturally.
const INPUT_LABELS: Record<string, string> = {
  self_employed_filing: "a freelancer or self-employed filing",
  freelanceIncome: "freelance income",
  gigWorkIncome: "gig-work income",
  businessRevenue: "business revenue",
  businessExpenses: "business expenses",
  homeOfficeExpenses: "home-office expenses",
  vehicleExpenses: "vehicle expenses",
  investmentIncome: "investment income",
  capitalGains: "capital gains",
  rentalIncome: "rental income",
  foreignIncome: "foreign income",
  medicalExpenses: "medical expenses",
  donations: "donations",
  employmentExpenses: "employment expenses",
  salaryIncome: "salary income",
  studentIncome: "student income",
};

function labelFor(token: string): string {
  return INPUT_LABELS[token] ?? token;
}

// Join a list of phrases into "a", "a and b", or "a, b and c".
function toSentenceList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// One match is a reasonable guess, two or more is a confident match.
function confidenceFromCount(count: number): Confidence {
  return count >= 2 ? "high" : "medium";
}

// Most self-file products can be paired with an expert review, so we surface
// that as a gentle optional upgrade rather than pushing a different plan.
function expertReviewUpgrade(): OptionalUpgrade {
  const expert = requireProduct("expert-assist");
  return {
    productId: expert.id,
    productName: expert.name,
    reason:
      "If you would like a tax expert to look over your return before you file, Expert Assist adds expert chat and a review.",
  };
}

// Look for selections that contradict each other or that the chosen product
// cannot cover on its own. These never block a recommendation, they just warn.
function buildWarnings(answers: QuestionnaireAnswers): string[] {
  const warnings: string[] = [];
  const deductions = new Set(answers.deductions);

  const realDeductions = answers.deductions.filter((d) => d !== "none");
  if (deductions.has("none") && realDeductions.length > 0) {
    warnings.push(
      'You picked "No special deductions" together with one or more specific deductions. We went with the specific deductions you selected.',
    );
  }

  if (answers.filingType === "incorporated") {
    const personalIncome = answers.incomeSources.filter(
      (s) => s !== "businessRevenue",
    );
    if (personalIncome.length > 0) {
      warnings.push(
        "A corporate product covers the company return only. Personal income such as salary or investments is usually filed on a separate personal product.",
      );
    }
  }

  return warnings;
}

function buildResult(
  productId: string,
  confidence: Confidence,
  reasons: string[],
  matchedInputs: string[],
  warnings: string[],
  optionalUpgrade?: OptionalUpgrade,
): RecommendationResult {
  const product = requireProduct(productId);
  return {
    recommendedProductId: product.id,
    recommendedProductName: product.name,
    price: product.price,
    confidence,
    reasons,
    matchedInputs,
    optionalUpgrade,
    warnings: warnings.length > 0 ? warnings : undefined,
    disclaimer: DISCLAIMER,
  };
}

/**
 * The recommendation engine. Rules are checked in priority order, highest
 * first, and the first rule that matches wins. This is what keeps corporate
 * rules above personal ones and expert help above the lower plans.
 *
 * Priority:
 *   1. Incorporated company  -> Business Corporate / Nil Corporate Return
 *   2. Expert files for me    -> Expert Full Service
 *   3. Expert help on the side -> Expert Assist
 *   4. Self-employed signals  -> Self-Employed
 *   5. Investments / rentals  -> Premier
 *   6. Common deductions      -> Deluxe
 *   7. Simple situation       -> Free
 */
export function recommend(answers: QuestionnaireAnswers): RecommendationResult {
  const warnings = buildWarnings(answers);
  const income = new Set(answers.incomeSources);
  const deductions = new Set(answers.deductions);

  // Rule 1: an incorporated company overrides every personal product.
  if (answers.filingType === "incorporated") {
    if (answers.companyHadRevenue === false) {
      return buildResult(
        "nil-corporate-return",
        "high",
        [
          "You are filing for an incorporated company that had no revenue.",
          "Nil Corporate Return covers a no-revenue corporate filing.",
        ],
        ["incorporated", "noRevenue"],
        warnings,
      );
    }
    return buildResult(
      "business-corporate",
      "high",
      [
        "You are filing for an incorporated company.",
        "Business Corporate covers the corporate return, business revenue and business expenses.",
      ],
      ["incorporated"],
      warnings,
    );
  }

  // Rule 2: wanting an expert to file outranks the self-file plans.
  if (answers.helpPreference === "expert_file") {
    return buildResult(
      "expert-full-service",
      "high",
      [
        "You asked for an expert to prepare and file your return.",
        "Expert Full Service has a tax expert prepare and file the return for you.",
      ],
      ["expert_file"],
      warnings,
    );
  }

  // Rule 3: wanting expert help while filing.
  if (answers.helpPreference === "expert_help") {
    return buildResult(
      "expert-assist",
      "high",
      [
        "You asked for expert help while you file.",
        "Expert Assist gives you expert chat, a video call and an expert review before you file.",
      ],
      ["expert_help"],
      warnings,
    );
  }

  // Rule 4: self-employment signals point to the Self-Employed product.
  const selfEmployedMatches: string[] = [];
  if (answers.filingType === "self_employed") {
    selfEmployedMatches.push("self_employed_filing");
  }
  if (income.has("freelanceIncome")) selfEmployedMatches.push("freelanceIncome");
  if (income.has("gigWorkIncome")) selfEmployedMatches.push("gigWorkIncome");
  if (income.has("businessRevenue")) selfEmployedMatches.push("businessRevenue");
  if (deductions.has("businessExpenses")) selfEmployedMatches.push("businessExpenses");
  if (deductions.has("homeOfficeExpenses")) selfEmployedMatches.push("homeOfficeExpenses");
  if (deductions.has("vehicleExpenses")) selfEmployedMatches.push("vehicleExpenses");

  if (selfEmployedMatches.length > 0) {
    const labelled = selfEmployedMatches
      .filter((m) => m !== "self_employed_filing")
      .map(labelFor);
    const reasons: string[] = [];
    if (selfEmployedMatches.includes("self_employed_filing")) {
      reasons.push("You chose the freelancer or self-employed filing type.");
    }
    if (labelled.length > 0) {
      reasons.push(`You selected ${toSentenceList(labelled)}.`);
    }
    reasons.push(
      "Self-Employed supports freelance, gig-work and business-related expenses.",
    );
    return buildResult(
      "self-employed",
      confidenceFromCount(selfEmployedMatches.length),
      reasons,
      selfEmployedMatches,
      warnings,
      expertReviewUpgrade(),
    );
  }

  // Rule 5: investments, capital gains, rental or foreign income -> Premier.
  const premierMatches: string[] = [];
  if (income.has("investmentIncome")) premierMatches.push("investmentIncome");
  if (income.has("capitalGains")) premierMatches.push("capitalGains");
  if (income.has("rentalIncome")) premierMatches.push("rentalIncome");
  if (income.has("foreignIncome")) premierMatches.push("foreignIncome");

  if (premierMatches.length > 0) {
    const labelled = premierMatches.map(labelFor);
    return buildResult(
      "premier",
      confidenceFromCount(premierMatches.length),
      [
        `You selected ${toSentenceList(labelled)}.`,
        "Premier covers investment income, capital gains, foreign income and rental income.",
      ],
      premierMatches,
      warnings,
      expertReviewUpgrade(),
    );
  }

  // Rule 6: common deductions -> Deluxe.
  const deluxeMatches: string[] = [];
  if (deductions.has("medicalExpenses")) deluxeMatches.push("medicalExpenses");
  if (deductions.has("donations")) deluxeMatches.push("donations");
  if (deductions.has("employmentExpenses")) deluxeMatches.push("employmentExpenses");

  if (deluxeMatches.length > 0) {
    const labelled = deluxeMatches.map(labelFor);
    return buildResult(
      "deluxe",
      confidenceFromCount(deluxeMatches.length),
      [
        `You selected ${toSentenceList(labelled)}.`,
        "Deluxe covers everyday deductions like medical expenses, donations and employment expenses.",
      ],
      deluxeMatches,
      warnings,
      expertReviewUpgrade(),
    );
  }

  // Rule 7: nothing complex showed up, so a simple Free return fits.
  const freeMatches: string[] = [];
  if (income.has("salaryIncome")) freeMatches.push("salaryIncome");
  if (income.has("studentIncome")) freeMatches.push("studentIncome");

  const freeReasons: string[] = [];
  if (freeMatches.length > 0) {
    freeReasons.push(`You selected ${toSentenceList(freeMatches.map(labelFor))}.`);
  }
  freeReasons.push(
    "Nothing in your answers needs a paid plan, so a simple Free return fits.",
  );
  return buildResult(
    "free",
    "medium",
    freeReasons,
    freeMatches,
    warnings,
    {
      productId: "deluxe",
      productName: "Deluxe",
      reason:
        "If you later have donations, medical expenses or employment expenses to claim, Deluxe covers those.",
    },
  );
}

// Server-side validation that mirrors the rules in section 14 of the brief.
export function validateAnswers(answers: QuestionnaireAnswers): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!answers.filingType) {
    errors.push({ field: "filingType", message: "Please choose what you are filing for." });
  }

  // For personal and self-employed filings we need at least one income source.
  // Incorporated companies answer the revenue question instead, so we do not
  // force an income source on them.
  if (answers.filingType !== "incorporated") {
    if (!answers.incomeSources || answers.incomeSources.length === 0) {
      errors.push({
        field: "incomeSources",
        message: "Please select at least one income source.",
      });
    }
  }

  if (!answers.helpPreference) {
    errors.push({
      field: "helpPreference",
      message: "Please tell us how much help you want.",
    });
  }

  if (answers.filingType === "incorporated" && answers.companyHadRevenue === null) {
    errors.push({
      field: "companyHadRevenue",
      message: "Please tell us whether the company had revenue.",
    });
  }

  return errors;
}
