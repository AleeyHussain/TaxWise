"use client";

import Link from "next/link";
import { useState } from "react";
import ConfidenceBadge from "@/components/marketing/ConfidenceBadge";
import Disclaimer from "@/components/marketing/Disclaimer";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { exportRecommendationPdf } from "@/features/recommend/export-pdf";
import ScenarioModal from "./ScenarioModal";
import type { RecommendationResult, QuestionnaireAnswers } from "@/types";

export function ResultView({
  result,
  answers,
  onRestart,
  onApplyScenario,
}: {
  result: RecommendationResult;
  answers: QuestionnaireAnswers;
  onRestart: () => void;
  onApplyScenario: (updated: QuestionnaireAnswers) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      const b64 = btoa(JSON.stringify(answers));
      const url = `${window.location.origin}/recommend?data=${b64}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 px-6 py-6 text-white">
          <p className="text-xs font-bold tracking-wider text-blue-200 uppercase">
            Recommended Plan
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold sm:text-3xl text-white">
              {result.recommendedProductName}
            </h2>
            <span className="text-2xl font-bold text-emerald-400">
              {formatPrice(result.price)}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ConfidenceBadge confidence={result.confidence} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-secondary btn-sm"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Link copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy shareable link</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => exportRecommendationPdf(result)}
                className="btn btn-secondary btn-sm"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download summary (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setScenarioOpen(true)}
                className="btn btn-secondary btn-sm"
              >
                <span>&ldquo;What if?&rdquo; Scenarios</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Why this plan
            </h3>
            <ul className="mt-3 space-y-2">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.matchedInputs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Matched factors
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {result.matchedInputs.map((token) => (
                  <span key={token} className="badge badge-brand">
                    {token}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.optionalUpgrade && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/40">
              <p className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Optional upgrade: {result.optionalUpgrade.productName}
              </p>
              <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
                {result.optionalUpgrade.reason}
              </p>
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Worth a look
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <Disclaimer text={result.disclaimer} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onRestart} className="btn btn-secondary">
          Start over
        </button>
        <Link href="/compare" className="btn btn-ghost">
          Compare all plans
        </Link>
        <Link href="/assistant" className="btn btn-ghost">
          Ask the assistant
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <ScenarioModal
        isOpen={scenarioOpen}
        onClose={() => setScenarioOpen(false)}
        answers={answers}
        onApply={onApplyScenario}
      />
    </div>
  );
}
