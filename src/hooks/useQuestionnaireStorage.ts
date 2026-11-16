"use client";

import { useEffect, useState } from "react";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import type { QuestionnaireAnswers } from "@/types";

export const STORAGE_KEY = "taxwise:wizard";

export const EMPTY_ANSWERS: QuestionnaireAnswers = {
  filingType: null,
  incomeSources: [],
  deductions: [],
  helpPreference: null,
  companyHadRevenue: null,
};

export function useQuestionnaireStorage() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(EMPTY_ANSWERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const validated = questionnaireAnswersSchema.safeParse(parsed);
        if (validated.success) {
          setAnswers({ ...EMPTY_ANSWERS, ...validated.data });
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setAnswers(EMPTY_ANSWERS);
        }
      }
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setAnswers(EMPTY_ANSWERS);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers, hydrated]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAnswers(EMPTY_ANSWERS);
  };

  return {
    answers,
    setAnswers,
    hydrated,
    clearStorage,
  };
}
