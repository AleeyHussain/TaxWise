import { z } from "zod";

export const filingTypeSchema = z.enum(["personal", "self_employed", "incorporated"]);

export const incomeSourceSchema = z.enum([
  "salaryIncome",
  "studentIncome",
  "investmentIncome",
  "capitalGains",
  "rentalIncome",
  "freelanceIncome",
  "gigWorkIncome",
  "businessRevenue",
  "foreignIncome",
]);

export const deductionSchema = z.enum([
  "medicalExpenses",
  "donations",
  "employmentExpenses",
  "homeOfficeExpenses",
  "vehicleExpenses",
  "businessExpenses",
  "none",
]);

export const helpPreferenceSchema = z.enum(["self", "expert_help", "expert_file"]);

export const questionnaireAnswersSchema = z.object({
  filingType: filingTypeSchema.nullable().default(null),
  incomeSources: z.array(incomeSourceSchema).default([]),
  deductions: z.array(deductionSchema).default([]),
  helpPreference: helpPreferenceSchema.nullable().default(null),
  companyHadRevenue: z.boolean().nullable().default(null),
});

export type QuestionnaireAnswersInput = z.infer<typeof questionnaireAnswersSchema>;
