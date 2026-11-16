import { requireProduct } from "@/features/products/catalogue";
import { DISCLAIMER } from "@/lib/constants";
import type {
  Confidence,
  OptionalUpgrade,
  QuestionnaireAnswers,
  RecommendationResult,
} from "@/types";
import { confidenceFromCount, labelFor, toSentenceList } from "./labels";
import { buildWarnings } from "./warnings";

function expertReviewUpgrade(): OptionalUpgrade {
  const expert = requireProduct("expert-assist");
  return {
    productId: expert.id,
    productName: expert.name,
    reason:
      "If you would like a tax expert to look over your return before you file, Expert Assist adds expert chat and a review.",
  };
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
