"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Check, Copy, Download, SlidersHorizontal } from "lucide-react";
import ConfidenceBadge from "@/components/marketing/ConfidenceBadge";
import Disclaimer from "@/components/marketing/Disclaimer";
import { formatPrice } from "@/lib/format";
import { exportRecommendationPdf } from "@/features/recommend/export-pdf";
import ScenarioModal from "./ScenarioModal";
import ResultActionButtons from "./ResultActionButtons";
import type { RecommendationResult, QuestionnaireAnswers } from "@/types";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

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
      toast.success("Shareable link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link to clipboard.");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EXPO_OUT }}
        className="card overflow-hidden border-subtle"
      >
        <div className="bg-gradient-to-r from-trust via-blue-900 to-base px-6 py-6 text-white">
          <p className="text-xs font-bold tracking-wider text-blue-200 uppercase">
            Recommended Plan
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold sm:text-3xl text-white">
              {result.recommendedProductName}
            </h2>
            <span className="text-2xl font-bold text-success">
              {formatPrice(result.price)}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-7 bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ConfidenceBadge confidence={result.confidence} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn btn-secondary btn-sm"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5 text-success font-semibold"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy shareable link</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                type="button"
                onClick={() => {
                  exportRecommendationPdf(result);
                  toast.success("Summary PDF generated!");
                }}
                className="btn btn-secondary btn-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download summary (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setScenarioOpen(true)}
                className="btn btn-secondary btn-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>&ldquo;What if?&rdquo; Scenarios</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-primary">
              Why this plan
            </h3>
            <ul className="mt-3 space-y-2.5">
              {result.reasons.map((reason, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease: EXPO_OUT }}
                  className="flex items-start gap-2.5 text-sm text-secondary"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{reason}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {result.matchedInputs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-primary">
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
            <div className="rounded-xl border border-trust/30 bg-elevated p-4">
              <p className="text-sm font-bold text-trust">
                Optional upgrade: {result.optionalUpgrade.productName}
              </p>
              <p className="mt-1 text-sm text-secondary">
                {result.optionalUpgrade.reason}
              </p>
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="text-sm font-bold text-warning">
                Worth a look
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-secondary">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <Disclaimer text={result.disclaimer} />
        </div>
      </motion.div>

      <ResultActionButtons onRestart={onRestart} />

      <ScenarioModal
        isOpen={scenarioOpen}
        onClose={() => setScenarioOpen(false)}
        answers={answers}
        onApply={onApplyScenario}
      />
    </div>
  );
}
