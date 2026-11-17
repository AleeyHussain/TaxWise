"use client";

import { useState } from "react";
import type { QuestionnaireAnswers, IncomeSource, HelpPreference } from "@/types";
import { Button } from "@/components/ui/Button";

export default function ScenarioModal({
  isOpen,
  onClose,
  answers,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  answers: QuestionnaireAnswers;
  onApply: (updated: QuestionnaireAnswers) => void;
}) {
  const [draft, setDraft] = useState<QuestionnaireAnswers>(answers);

  if (!isOpen) return null;

  const toggleDraftIncome = (src: IncomeSource) => {
    setDraft((prev) => {
      const has = prev.incomeSources.includes(src);
      return {
        ...prev,
        incomeSources: has
          ? prev.incomeSources.filter((s) => s !== src)
          : [...prev.incomeSources, src],
      };
    });
  };

  const setDraftHelp = (help: HelpPreference) => {
    setDraft((prev) => ({ ...prev, helpPreference: help }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="What If Scenario Mode"
    >
      <div className="glass-4 w-full max-w-lg p-6 rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary">
              &ldquo;What If?&rdquo; Scenario Explorer
            </h3>
            <p className="mt-1 text-sm text-secondary">
              Tweak your tax profile to see how recommendations adapt in real time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-elevated hover:text-primary transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-bold text-primary uppercase">
              Income Scenarios
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["rentalIncome", "Rental Income"],
                  ["capitalGains", "Capital Gains"],
                  ["freelanceIncome", "Freelance Income"],
                  ["businessRevenue", "Business Revenue"],
                ] as const
              ).map(([key, label]) => {
                const checked = draft.incomeSources.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleDraftIncome(key)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-medium transition ${
                      checked
                        ? "border-trust bg-trust/10 text-primary font-bold"
                        : "border-subtle bg-surface text-secondary hover:border-trust/40 hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {label}
                      <span className="font-bold">{checked ? "✓" : "+"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-primary uppercase">
              Expert Guidance Preference
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["self", "Self (None)"],
                  ["expert_help", "Expert Assist"],
                  ["expert_file", "Full Service"],
                ] as const
              ).map(([val, label]) => {
                const active = draft.helpPreference === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDraftHelp(val)}
                    className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                      active
                        ? "border-trust bg-trust/10 text-primary font-bold"
                        : "border-subtle bg-surface text-secondary hover:border-trust/40 hover:text-primary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 border-t border-subtle pt-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Recalculate recommendation
          </Button>
        </div>
      </div>
    </div>
  );
}
