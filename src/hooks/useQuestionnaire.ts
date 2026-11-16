"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Deduction,
  FilingType,
  HelpPreference,
  IncomeSource,
  QuestionnaireAnswers,
  RecommendationResult,
} from "@/types";

export const STORAGE_KEY = "taxwise:wizard";

export const EMPTY_ANSWERS: QuestionnaireAnswers = {
  filingType: null,
  incomeSources: [],
  deductions: [],
  helpPreference: null,
  companyHadRevenue: null,
};

export type StepKey = "filing" | "income" | "deductions" | "help" | "revenue" | "result";

export function useQuestionnaire() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(EMPTY_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ["filing", "income", "deductions", "help"];
    if (answers.filingType === "incorporated") base.push("revenue");
    base.push("result");
    return base;
  }, [answers.filingType]);

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const inputSteps = steps.filter((s) => s !== "result");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers({ ...EMPTY_ANSWERS, ...JSON.parse(saved) });
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
  }, []);

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
      if (value === "none") {
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
    if (loading) return;
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
    setAnswers(EMPTY_ANSWERS);
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
  };
}
