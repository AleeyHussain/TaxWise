import type { Confidence } from "@/types/recommendation";

export const INPUT_LABELS: Record<string, string> = {
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

export function labelFor(token: string): string {
  return INPUT_LABELS[token] ?? token;
}

export function toSentenceList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function confidenceFromCount(count: number): Confidence {
  return count >= 2 ? "high" : "medium";
}
