"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import { validateWizardStep, type WizardStepKey } from "@/features/recommend/step-validation";
import { useQuestionnaireStorage, EMPTY_ANSWERS } from "./useQuestionnaireStorage";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
  RecommendationResult,
} from "@/types";

export type StepKey = WizardStepKey;

export function useQuestionnaire() {
  const searchParams = useSearchParams();
  const { answers, setAnswers, hydrated, clearStorage } = useQuestionnaireStorage();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ["filing", "income", "deductions", "help"];
    if (answers.filingType === "incorporated") base.push("revenue");
    base.push("result");
    return base;
  }, [answers.filingType]);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const inputSteps = steps.filter((s) => s !== "result");

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

  useEffect(() => {
    const encoded = searchParams.get("data");
    if (!encoded) return;
    try {
      const decodedJson = atob(encoded);
      const parsed = JSON.parse(decodedJson);
      const validated = questionnaireAnswersSchema.safeParse(parsed);
      if (validated.success) {
        setAnswers(validated.data);
        setStepIndex(steps.length - 1);
        void fetchResult(validated.data);
      }
    } catch {}
  }, [searchParams, steps.length, setAnswers, fetchResult]);

  function setFiling(value: FilingType) {
    setAnswers((prev) => ({
      ...prev,
      filingType: value,
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
      if (value === "none") return { ...prev, deductions: has ? [] : ["none"] };
      const withoutNone = prev.deductions.filter((v) => v !== "none");
      return {
        ...prev,
        deductions: has ? withoutNone.filter((v) => v !== value) : [...withoutNone, value],
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

  function goNext() {
    if (loading) return;
    const problem = validateWizardStep(currentStep, answers);
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
    clearStorage();
    setResult(null);
    setApiError(null);
    setError(null);
    setStepIndex(0);
  }

  function applyScenario(updated: QuestionnaireAnswers) {
    setAnswers(updated);
    void fetchResult(updated);
  }

  return {
    answers,
    setAnswers,
    stepIndex,
    setStepIndex,
    steps,
    currentStep,
    inputSteps,
    error,
    result,
    loading,
    apiError,
    hydrated,
    setFiling,
    toggleIncome,
    toggleDeduction,
    setHelp,
    setRevenue,
    goNext,
    goBack,
    restart,
    fetchResult,
    applyScenario,
  };
}
