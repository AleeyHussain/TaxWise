import Link from "next/link";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import Disclaimer from "@/components/Disclaimer";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import type { RecommendationResult } from "@/lib/types";

// Friendly labels for the matched-input tokens the engine returns.
const MATCH_LABELS: Record<string, string> = {
  incorporated: "Incorporated company",
  noRevenue: "No company revenue",
  expert_file: "Wants an expert to file",
  expert_help: "Wants expert help",
  self_employed_filing: "Self-employed filing",
  freelanceIncome: "Freelance income",
  gigWorkIncome: "Gig-work income",
  businessRevenue: "Business revenue",
  businessExpenses: "Business expenses",
  homeOfficeExpenses: "Home-office expenses",
  vehicleExpenses: "Vehicle expenses",
  investmentIncome: "Investment income",
  capitalGains: "Capital gains",
  rentalIncome: "Rental income",
  foreignIncome: "Foreign income",
  medicalExpenses: "Medical expenses",
  donations: "Donations",
  employmentExpenses: "Employment expenses",
  salaryIncome: "Salary income",
  studentIncome: "Student income",
};

function matchLabel(token: string): string {
  return MATCH_LABELS[token] ?? token;
}

export default function RecommendationResultView({
  result,
  onRestart,
}: {
  result: RecommendationResult;
  onRestart: () => void;
}) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-brand-600 px-6 py-5 text-white dark:bg-brand-700">
          <p className="text-sm font-medium text-brand-50">Recommended plan</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{result.recommendedProductName}</h2>
            <span className="text-xl font-bold">{formatPrice(result.price)}</span>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <ConfidenceBadge confidence={result.confidence} />

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Why this plan
            </h3>
            <ul className="mt-2 space-y-2">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.matchedInputs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Based on your answers
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.matchedInputs.map((token) => (
                  <span key={token} className="badge badge-brand">
                    {matchLabel(token)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.optionalUpgrade && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Optional upgrade: {result.optionalUpgrade.productName}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {result.optionalUpgrade.reason}
              </p>
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Worth a look
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <Disclaimer text={result.disclaimer} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
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
    </div>
  );
}
