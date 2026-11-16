import { getProductById } from "@/features/products/catalogue";
import type {
  Deduction,
  FeatureKey,
  FilingType,
  HelpPreference,
  IncomeSource,
  Product,
  QuestionnaireAnswers,
} from "@/types";

export interface ParsedSignals {
  answers: QuestionnaireAnswers;
  neededFeatures: FeatureKey[];
  mentionedProducts: Product[];
}

export function detectFilingType(q: string): FilingType {
  if (/incorporat|corporation|\bcorp\b/.test(q) || (/\bcompany\b/.test(q) && /(revenue|nil|incorporat)/.test(q))) {
    return "incorporated";
  }
  if (/freelanc|self[- ]employ|contractor|sole propriet|\bgig\b/.test(q)) {
    return "self_employed";
  }
  return "personal";
}

export function detectHelp(q: string): HelpPreference {
  if (/(file|do|handle|prepare).{0,20}(for me)|someone else to file|full service|hand (it|everything) over|expert to file/.test(q)) {
    return "expert_file";
  }
  if (/expert help|help while|need help|expert review|review before|talk to (an|a) expert|expert assist|help from (an|a) expert/.test(q)) {
    return "expert_help";
  }
  return "self";
}

export function detectIncome(q: string): IncomeSource[] {
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

export function detectDeductions(q: string): Deduction[] {
  const found: Deduction[] = [];
  if (/medical|prescription|dental/.test(q)) found.push("medicalExpenses");
  if (/donation|charit|donate/.test(q)) found.push("donations");
  if (/employment expense|union dues/.test(q)) found.push("employmentExpenses");
  if (/home[- ]office|work from home/.test(q)) found.push("homeOfficeExpenses");
  if (/vehicle|mileage|car expense/.test(q)) found.push("vehicleExpenses");
  if (/business expense|supplies|equipment/.test(q)) found.push("businessExpenses");
  return found;
}

export function detectRevenue(q: string): boolean | null {
  if (/no revenue|without revenue|\bnil\b|zero revenue|no income|had no revenue/.test(q)) return false;
  if (/had revenue|with revenue|made (money|sales)|earned revenue|company.*revenue/.test(q)) return true;
  return null;
}

export function neededFeaturesFrom(answers: QuestionnaireAnswers): FeatureKey[] {
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

export function findMentionedProducts(q: string): Product[] {
  const matches: Product[] = [];
  const test = (id: string, re: RegExp) => {
    if (re.test(q)) {
      const p = getProductById(id);
      if (p && !matches.includes(p)) matches.push(p);
    }
  };
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

export function parseSignals(question: string): ParsedSignals {
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
