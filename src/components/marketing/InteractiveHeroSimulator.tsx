"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface Situation {
  id: string;
  label: string;
  form: string;
}

const SITUATIONS: Situation[] = [
  { id: "w2", label: "W-2 Employment", form: "Form 1040" },
  { id: "freelance", label: "1099-NEC Freelance", form: "Schedule C" },
  { id: "homeoffice", label: "Home Office Deduction", form: "Form 8829" },
  { id: "investments", label: "Stocks / Crypto", form: "Schedule D" },
  { id: "scorp", label: "LLC / S-Corp Pass-Through", form: "Form 1120-S" },
];

export default function InteractiveHeroSimulator() {
  const [selected, setSelected] = useState<string[]>(["w2", "freelance"]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]
    );
  };

  const hasCorp = selected.includes("scorp");
  const hasFreelance = selected.includes("freelance") || selected.includes("homeoffice");
  const hasInvestments = selected.includes("investments");

  let planName = "TaxWise Free";
  let planPrice = "$0";
  let competitorEstimate = "$89";
  let savings = "$89";
  let reasoning = "Standard W-2 deduction with zero schedule attachments.";

  if (hasCorp) {
    planName = "Corporate Business";
    planPrice = "$149.99";
    competitorEstimate = "$279.99";
    savings = "$130.00";
    reasoning = "Form 1120-S corporate tax return and Schedule K-1 distribution reporting.";
  } else if (hasFreelance) {
    planName = "Self-Employed";
    planPrice = "$49.99";
    competitorEstimate = "$129.99";
    savings = "$80.00";
    reasoning = "Schedule C self-employment write-offs and Form 8829 home office calculation.";
  } else if (hasInvestments) {
    planName = "Deluxe";
    planPrice = "$29.99";
    competitorEstimate = "$89.99";
    savings = "$60.00";
    reasoning = "Schedule D capital gains reporting with cost-basis reconciliation.";
  }

  const detectedForms = SITUATIONS.filter((s) => selected.includes(s.id)).map((s) => s.form);

  return (
    <div className="w-full max-w-[460px] rounded-3xl border border-border-strong glass-3 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Corner Registration Marks */}
      <div className="absolute top-2 left-2.5 font-mono text-[9px] text-tertiary select-none">+</div>
      <div className="absolute top-2 right-2.5 font-mono text-[9px] text-tertiary select-none">+</div>

      {/* Simulator Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-success animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-secondary uppercase">
            Live Engine Matcher
          </span>
        </div>
        <span className="font-mono text-[10px] text-tertiary bg-elevated px-2 py-0.5 rounded border border-border-subtle">
          IRS RULE v2.4
        </span>
      </div>

      {/* Interactive Filing Situations */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-secondary mb-2.5">
          Select your 2026 tax situation:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SITUATIONS.map((s) => {
            const active = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-accent-primary text-white shadow-xs"
                    : "bg-surface border border-border-subtle text-secondary hover:text-primary hover:border-border-strong"
                }`}
              >
                {active && <Check className="h-3 w-3 stroke-[3]" />}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Results Card */}
      <div className="mt-4 rounded-2xl bg-base/80 border border-border-subtle p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-tertiary">
              Recommended Plan
            </span>
            <div className="text-lg font-extrabold text-primary flex items-center gap-2 mt-0.5">
              <span>{planName}</span>
              <span className="font-mono text-sm text-accent-success font-bold">{planPrice}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-wider text-tertiary">
              Estimated Savings
            </span>
            <div className="font-mono text-xs font-bold text-accent-cta">
              Save {savings} vs Big Prep
            </div>
          </div>
        </div>

        {/* Detected Schedules */}
        <div className="mt-3 pt-3 border-t border-border-subtle flex flex-wrap gap-1">
          {detectedForms.map((f) => (
            <span
              key={f}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-secondary"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Reasoning */}
        <p className="mt-2.5 text-xs text-secondary leading-relaxed">
          <strong className="text-primary font-semibold">Statutory reason: </strong>
          {reasoning}
        </p>
      </div>

      {/* Bottom CTA Action */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[11px] text-tertiary flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-success" />
          No sign-up required
        </span>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent-cta px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-accent-cta-hover transition-colors"
        >
          <span>Run Full Engine</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
