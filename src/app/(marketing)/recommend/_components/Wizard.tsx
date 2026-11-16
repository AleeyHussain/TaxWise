"use client";

import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { ArrowRightIcon } from "@/components/icons";
import { WizardStep } from "./WizardStep";
import { ResultView } from "./ResultView";

const STEP_LABEL: Record<string, string> = {
  filing: "Filing",
  income: "Income",
  deductions: "Deductions",
  help: "Help",
  revenue: "Revenue",
  result: "Result",
};

export function Wizard() {
  const {
    answers,
    stepIndex,
    steps,
    currentStep,
    inputSteps,
    error,
    result,
    loading,
    apiError,
    setFiling,
    toggleIncome,
    toggleDeduction,
    setHelp,
    setRevenue,
    goNext,
    goBack,
    restart,
    fetchResult,
  } = useQuestionnaire();

  const progress =
    currentStep === "result"
      ? 100
      : (inputSteps.indexOf(currentStep) / inputSteps.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Find my plan
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
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step body */}
      {currentStep !== "result" && (
        <div className="card animate-fade-in p-6">
          <WizardStep
            currentStep={currentStep}
            answers={answers}
            setFiling={setFiling}
            toggleIncome={toggleIncome}
            toggleDeduction={toggleDeduction}
            setHelp={setHelp}
            setRevenue={setRevenue}
          />

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
            <button
              type="button"
              onClick={goNext}
              disabled={loading}
              className="btn btn-primary"
            >
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
            <ResultView result={result} onRestart={restart} />
          )}
        </div>
      )}
    </div>
  );
}
