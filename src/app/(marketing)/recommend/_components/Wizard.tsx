"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { ArrowRight } from "lucide-react";
import { WizardStep } from "./WizardStep";
import { ResultView } from "./ResultView";
import { STEP_LABEL, STEP_VARIANTS } from "./wizard-constants";
import { Button } from "@/components/ui/Button";

export function Wizard() {
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
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
    goNext: rawGoNext,
    goBack: rawGoBack,
    restart,
    fetchResult,
    applyScenario,
  } = useQuestionnaire();

  const goNext = () => {
    setDirection(1);
    rawGoNext();
  };

  const goBack = () => {
    setDirection(-1);
    rawGoBack();
  };

  const progress =
    currentStep === "result"
      ? 100
      : (inputSteps.indexOf(currentStep) / inputSteps.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Find my plan
        </h1>
        <p className="mt-2 text-secondary">
          A few quick questions to match your income, deductions, and tax needs to the right plan.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-secondary">
          {steps.map((s, i) => (
            <span
              key={s}
              className={
                i === stepIndex
                  ? "text-trust font-bold"
                  : i < stepIndex
                    ? "text-primary"
                    : ""
              }
            >
              {STEP_LABEL[s]}
            </span>
          ))}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-elevated border border-subtle">
          <div
            className="h-full rounded-full bg-trust transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step body with sliding AnimatePresence */}
      {currentStep !== "result" && (
        <div className="card overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={shouldReduceMotion ? undefined : STEP_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <WizardStep
                currentStep={currentStep}
                answers={answers}
                setFiling={setFiling}
                toggleIncome={toggleIncome}
                toggleDeduction={toggleDeduction}
                setHelp={setHelp}
                setRevenue={setRevenue}
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="mt-4 text-sm font-semibold text-danger">{error}</p>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-subtle pt-6">
            <Button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              variant="ghost"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={goNext}
              disabled={loading}
              variant="primary"
            >
              {steps[stepIndex + 1] === "result" ? "See my recommendation" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Result */}
      {currentStep === "result" && (
        <div>
          {loading && (
            <div className="card overflow-hidden p-6 sm:p-8 animate-pulse space-y-6">
              <div className="h-12 w-3/4 rounded-xl bg-elevated" />
              <div className="h-6 w-1/3 rounded-lg bg-elevated" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-elevated" />
                <div className="h-4 w-5/6 rounded bg-elevated" />
                <div className="h-4 w-2/3 rounded bg-elevated" />
              </div>
            </div>
          )}

          {!loading && apiError && (
            <div className="card p-8 text-center">
              <p className="text-sm font-semibold text-danger">{apiError}</p>
              <div className="mt-5 flex justify-center gap-3">
                <Button type="button" onClick={goBack} variant="secondary">
                  Go back
                </Button>
                <Button
                  type="button"
                  onClick={() => fetchResult(answers)}
                  variant="primary"
                >
                  Try again
                </Button>
              </div>
            </div>
          )}

          {!loading && !apiError && result && (
            <ResultView
              result={result}
              answers={answers}
              onRestart={restart}
              onApplyScenario={applyScenario}
            />
          )}
        </div>
      )}
    </div>
  );
}
