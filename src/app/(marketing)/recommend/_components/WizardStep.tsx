import { OptionButton } from "./OptionButton";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
} from "@/types";
import type { StepKey } from "@/hooks/useQuestionnaire";

const FILING_OPTIONS: { value: FilingType; label: string; hint: string }[] = [
  { value: "personal", label: "Personal return", hint: "An individual filing their own taxes." },
  { value: "self_employed", label: "Freelancer / self-employed", hint: "Freelancers, contractors and gig workers." },
  { value: "incorporated", label: "Incorporated company", hint: "A registered corporation." },
];

const INCOME_OPTIONS: { value: IncomeSource; label: string }[] = [
  { value: "salaryIncome", label: "Salary income" },
  { value: "studentIncome", label: "Student income" },
  { value: "investmentIncome", label: "Investment income" },
  { value: "capitalGains", label: "Capital gains" },
  { value: "rentalIncome", label: "Rental income" },
  { value: "freelanceIncome", label: "Freelance income" },
  { value: "gigWorkIncome", label: "Gig-work income" },
  { value: "businessRevenue", label: "Business revenue" },
  { value: "foreignIncome", label: "Foreign income" },
];

const DEDUCTION_OPTIONS: { value: Deduction; label: string }[] = [
  { value: "medicalExpenses", label: "Medical expenses" },
  { value: "donations", label: "Donations" },
  { value: "employmentExpenses", label: "Employment expenses" },
  { value: "homeOfficeExpenses", label: "Home-office expenses" },
  { value: "vehicleExpenses", label: "Vehicle expenses" },
  { value: "businessExpenses", label: "Business expenses" },
  { value: "none", label: "No special deductions" },
];

const HELP_OPTIONS: { value: HelpPreference; label: string; hint: string }[] = [
  { value: "self", label: "I want to file myself", hint: "Do it on your own." },
  { value: "expert_help", label: "I want expert help while filing", hint: "Chat, a call and a review." },
  { value: "expert_file", label: "I want an expert to file for me", hint: "Hand it over fully." },
];

export function WizardStep({
  currentStep,
  answers,
  setFiling,
  toggleIncome,
  toggleDeduction,
  setHelp,
  setRevenue,
}: {
  currentStep: StepKey;
  answers: QuestionnaireAnswers;
  setFiling: (v: FilingType) => void;
  toggleIncome: (v: IncomeSource) => void;
  toggleDeduction: (v: Deduction) => void;
  setHelp: (v: HelpPreference) => void;
  setRevenue: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {currentStep === "filing" && (
        <fieldset>
          <legend className="text-lg font-semibold text-primary">
            What are you filing for?
          </legend>
          <div className="mt-4 space-y-3">
            {FILING_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                selected={answers.filingType === opt.value}
                label={opt.label}
                hint={opt.hint}
                onClick={() => setFiling(opt.value)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {currentStep === "income" && (
        <fieldset>
          <legend className="text-lg font-semibold text-primary">
            Which income sources apply to you?
          </legend>
          <p className="mt-1 text-sm text-secondary">
            Select all that apply.
            {answers.filingType === "incorporated" &&
              " This is optional for an incorporated company."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {INCOME_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                multi
                selected={answers.incomeSources.includes(opt.value)}
                label={opt.label}
                onClick={() => toggleIncome(opt.value)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {currentStep === "deductions" && (
        <fieldset>
          <legend className="text-lg font-semibold text-primary">
            Which deductions or expenses apply?
          </legend>
          <p className="mt-1 text-sm text-secondary">
            Select all that apply, or pick &ldquo;No special deductions&rdquo;.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEDUCTION_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                multi
                selected={answers.deductions.includes(opt.value)}
                label={opt.label}
                onClick={() => toggleDeduction(opt.value)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {currentStep === "help" && (
        <fieldset>
          <legend className="text-lg font-semibold text-primary">
            How much help do you want?
          </legend>
          <div className="mt-4 space-y-3">
            {HELP_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                selected={answers.helpPreference === opt.value}
                label={opt.label}
                hint={opt.hint}
                onClick={() => setHelp(opt.value)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {currentStep === "revenue" && (
        <fieldset>
          <legend className="text-lg font-semibold text-primary">
            Did the company have revenue?
          </legend>
          <div className="mt-4 space-y-3">
            <OptionButton
              selected={answers.companyHadRevenue === true}
              label="Yes, the company had revenue"
              onClick={() => setRevenue(true)}
            />
            <OptionButton
              selected={answers.companyHadRevenue === false}
              label="No, the company had no revenue"
              onClick={() => setRevenue(false)}
            />
          </div>
        </fieldset>
      )}
    </div>
  );
}
