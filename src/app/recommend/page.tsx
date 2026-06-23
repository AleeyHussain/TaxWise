"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import RecommendationResultView from "@/app/recommend/RecommendationResultView";
import { ArrowRightIcon } from "@/components/icons";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
  RecommendationResult,
} from "@/lib/types";

const STORAGE_KEY = "taxwise:wizard";

const EMPTY: QuestionnaireAnswers = {
  filingType: null,
  incomeSources: [],
  deductions: [],
  helpPreference: null,
  companyHadRevenue: null,
};

type StepKey = "filing" | "income" | "deductions" | "help" | "revenue" | "result";

const STEP_LABEL: Record<StepKey, string> = {
  filing: "Filing",
  income: "Income",
  deductions: "Deductions",
  help: "Help",
  revenue: "Revenue",
  result: "Result",
};

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

// ---- small presentational helpers -----------------------------------------

function OptionButton({
  selected,
  label,
  hint,
  onClick,
  multi,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
          multi ? "rounded-md" : "rounded-full"
        } ${
          selected
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <span className="text-[11px] leading-none">&#10003;</span>}
      </span>
      <span>
        <span className="block font-medium text-slate-900 dark:text-white">{label}</span>
        {hint && <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{hint}</span>}
      </span>
    </button>
  );
}

export default function RecommendPage() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(EMPTY);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // The step sequence depends on whether this is an incorporated filing.
  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ["filing", "income", "deductions", "help"];
    if (answers.filingType === "incorporated") base.push("revenue");
    base.push("result");
    return base;
  }, [answers.filingType]);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const inputSteps = steps.filter((s) => s !== "result");

  // Load any saved answers once on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers({ ...EMPTY, ...JSON.parse(saved) });
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
  }, []);

  // Persist answers as they change (after the initial load).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore storage failures
    }
  }, [answers, hydrated]);

  const fetchResult = useCallback(async (payload: QuestionnaireAnswers) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.errors?.map((e: { message: string }) => e.message).join(" ") ??
          "Something went wrong. Please try again.";
        setApiError(message);
        return;
      }
      setResult(data.result);
    } catch {
      setApiError("Could not reach the recommendation service. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- option handlers ----

  function setFiling(value: FilingType) {
    setAnswers((prev) => ({
      ...prev,
      filingType: value,
      // Drop the revenue answer if we are no longer incorporated.
      companyHadRevenue: value === "incorporated" ? prev.companyHadRevenue : null,
    }));
    setError(null);
  }

  function toggleIncome(value: IncomeSource) {
    setAnswers((prev) => {
      const has = prev.incomeSources.includes(value);
      return {
        ...prev,
        incomeSources: has
          ? prev.incomeSources.filter((v) => v !== value)
          : [...prev.incomeSources, value],
      };
    });
    setError(null);
  }

  function toggleDeduction(value: Deduction) {
    setAnswers((prev) => {
      const has = prev.deductions.includes(value);
      if (value === "none") {
        // "No special deductions" clears everything else.
        return { ...prev, deductions: has ? [] : ["none"] };
      }
      const withoutNone = prev.deductions.filter((v) => v !== "none");
      return {
        ...prev,
        deductions: has
          ? withoutNone.filter((v) => v !== value)
          : [...withoutNone, value],
      };
    });
    setError(null);
  }

  function setHelp(value: HelpPreference) {
    setAnswers((prev) => ({ ...prev, helpPreference: value }));
    setError(null);
  }

  function setRevenue(value: boolean) {
    setAnswers((prev) => ({ ...prev, companyHadRevenue: value }));
    setError(null);
  }

  // ---- navigation ----

  function validateStep(step: StepKey): string | null {
    switch (step) {
      case "filing":
        return answers.filingType ? null : "Please choose what you are filing for.";
      case "income":
        if (answers.filingType !== "incorporated" && answers.incomeSources.length === 0) {
          return "Please select at least one income source.";
        }
        return null;
      case "help":
        return answers.helpPreference ? null : "Please tell us how much help you want.";
      case "revenue":
        return answers.companyHadRevenue === null
          ? "Please tell us whether the company had revenue."
          : null;
      default:
        return null;
    }
  }

  function goNext() {
    const problem = validateStep(currentStep);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    if (steps[nextIndex] === "result") {
      void fetchResult(answers);
    }
  }

  function goBack() {
    setError(null);
    setApiError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setAnswers(EMPTY);
    setResult(null);
    setApiError(null);
    setError(null);
    setStepIndex(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const progress =
    currentStep === "result"
      ? 100
      : (inputSteps.indexOf(currentStep) / inputSteps.length) * 100;

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Find my product
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            A few quick questions and we will suggest the plan that fits best.
          </p>
        </header>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {steps.map((s, i) => (
              <span
                key={s}
                className={
                  i === stepIndex
                    ? "text-brand-700 dark:text-brand-300"
                    : i < stepIndex
                      ? "text-slate-700 dark:text-slate-200"
                      : ""
                }
              >
                {STEP_LABEL[s]}
              </span>
            ))}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step body */}
        {currentStep !== "result" && (
          <div className="card animate-fade-in p-6">
            {currentStep === "filing" && (
              <fieldset>
                <legend className="text-lg font-semibold text-slate-900 dark:text-white">
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
                <legend className="text-lg font-semibold text-slate-900 dark:text-white">
                  Which income sources apply to you?
                </legend>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                <legend className="text-lg font-semibold text-slate-900 dark:text-white">
                  Which deductions or expenses apply?
                </legend>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
                <legend className="text-lg font-semibold text-slate-900 dark:text-white">
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
                <legend className="text-lg font-semibold text-slate-900 dark:text-white">
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

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="btn btn-ghost"
              >
                Back
              </button>
              <button type="button" onClick={goNext} className="btn btn-primary">
                {steps[stepIndex + 1] === "result" ? "See my recommendation" : "Next"}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {currentStep === "result" && (
          <div>
            {loading && (
              <div className="card p-10 text-center text-slate-500 dark:text-slate-400">
                Working out your best fit...
              </div>
            )}

            {!loading && apiError && (
              <div className="card p-8 text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{apiError}</p>
                <div className="mt-4 flex justify-center gap-3">
                  <button type="button" onClick={goBack} className="btn btn-secondary">
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchResult(answers)}
                    className="btn btn-primary"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {!loading && !apiError && result && (
              <RecommendationResultView result={result} onRestart={restart} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
