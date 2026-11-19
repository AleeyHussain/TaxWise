"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function CampaignManifesto() {
  return (
    <section className="container-px py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EXPO_OUT }}
        className="rounded-3xl border border-border-strong glass-3 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
      >
        {/* Corner Bracket Accents */}
        <span className="absolute top-4 left-4 font-mono text-xs text-tertiary select-none">┌─</span>
        <span className="absolute top-4 right-4 font-mono text-xs text-tertiary select-none">─┐</span>
        <span className="absolute bottom-4 left-4 font-mono text-xs text-tertiary select-none">└─</span>
        <span className="absolute bottom-4 right-4 font-mono text-xs text-tertiary select-none">─┘</span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Manifesto Copy */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded border border-border-strong bg-base px-2.5 py-1 mb-5">
              <span className="font-mono text-[11px] font-bold text-accent-cta uppercase tracking-wider">
                Industry Manifesto · Vol. 2026
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-[1.12]">
              The commercial tax monopoly made \$14 billion by weaponizing complexity.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-secondary leading-relaxed max-w-[65ch]">
              For decades, mainstream tax software companies have lobbied to keep tax filing opaque.
              They trap filers after 45 minutes of manual data entry, demanding \$80 to \$150 upgrades
              simply to report an HSA contribution, a student loan deduction, or freelance 1099 income.
            </p>

            {/* Asymmetric Side-by-side Contrast */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-danger font-bold text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>The Legacy Trap</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs text-secondary leading-normal">
                  <li>• Hides free file options behind confusing dark patterns</li>
                  <li>• Forces paid upgrades for routine Schedule 1 attachments</li>
                  <li>• Re-bills annual recurring fees without explicit consent</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-accent-success/30 bg-accent-success/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-accent-success font-bold text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>The TaxWise Standard</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs text-secondary leading-normal">
                  <li>• 100% deterministic matching based on IRS statutory rules</li>
                  <li>• Plain-English breakdown of why you DO NOT need higher tiers</li>
                  <li>• Zero tracking cookies, zero upsell gates, zero saved data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Art-Directed Vector Guarantee Stamp / Seal */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Dashed Rotating Ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                  opacity="0.6"
                />
              </svg>

              {/* Inner Seal Body */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-accent-primary bg-base flex flex-col items-center justify-center text-center p-3 shadow-lg">
                <ShieldCheck className="h-8 w-8 text-accent-success mb-1" />
                <span className="font-mono text-[9px] font-bold text-secondary uppercase tracking-widest">
                  Verified Statutory
                </span>
                <span className="font-display text-sm font-extrabold text-primary leading-tight mt-0.5">
                  NO-UPSELL
                  <br />
                  GUARANTEE
                </span>
                <span className="font-mono text-[8px] text-tertiary mt-1">IRS SCHEDULE RULES</span>
              </div>
            </div>

            <Link
              href="/compare"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-trust hover:underline"
            >
              <span>READ THE STATUTORY COMPARISON</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
