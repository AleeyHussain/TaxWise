"use client";

import { motion } from "framer-motion";
import { Cpu, Check, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function EngineStorytelling() {
  return (
    <section className="container-px py-16 md:py-24 border-t border-border-subtle bg-surface/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Visual Architectural Diagram */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="lg:col-span-6"
        >
          <div className="rounded-3xl border border-border-strong glass-2 p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent-primary" />
                <span className="font-mono text-xs font-bold text-primary">
                  ENGINE_PIPELINE // AUDIT_TRACER
                </span>
              </div>
              <span className="font-mono text-[10px] text-accent-success bg-accent-success/10 px-2 py-0.5 rounded border border-accent-success/20">
                100% DETERMINISTIC
              </span>
            </div>

            {/* Pipeline Stage 1: Form Ingestion */}
            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl border border-border-subtle bg-base/80">
                <span className="font-mono text-[10px] text-tertiary uppercase">Stage 01: Tax Slip Intake</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-xs text-primary">
                  <span className="bg-elevated px-2 py-1 rounded border border-border-subtle">W-2 Wage</span>
                  <span className="bg-elevated px-2 py-1 rounded border border-border-subtle">1099-NEC</span>
                  <span className="bg-elevated px-2 py-1 rounded border border-border-subtle">Schedule C</span>
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="flex justify-center text-tertiary font-mono text-xs">↓</div>

              {/* Stage 02: Threshold & Deductive Analysis */}
              <div className="p-3.5 rounded-xl border border-accent-primary/40 bg-accent-primary/5">
                <span className="font-mono text-[10px] text-accent-primary uppercase font-bold">
                  Stage 02: Statutory Threshold Audit
                </span>
                <p className="mt-1 text-xs text-secondary leading-relaxed">
                  Evaluates whether itemized Schedule A deductions exceed 2026 standard limits ($15,000 single).
                  Rejects unnecessary Schedule A upgrades if standard deduction yields higher return.
                </p>
              </div>

              {/* Arrow Connector */}
              <div className="flex justify-center text-tertiary font-mono text-xs">↓</div>

              {/* Stage 03: Tier Resolution */}
              <div className="p-3.5 rounded-xl border border-accent-success/40 bg-accent-success/5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-accent-success uppercase font-bold">
                    Stage 03: Minimum Cost Tier
                  </span>
                  <div className="text-sm font-bold text-primary mt-0.5">Self-Employed Tier ($49.99)</div>
                </div>
                <div className="text-right font-mono text-xs font-bold text-accent-success">
                  Saves $80 vs $129 Bundles
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editorial Copy */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2 rounded border border-border-strong bg-base px-2.5 py-1 mb-4">
            <Layers className="h-3.5 w-3.5 text-accent-cta" />
            <span className="font-mono text-[11px] font-bold text-secondary uppercase tracking-wider">
              Under The Hood
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            How mathematical rules stop tax software price gouging.
          </h2>

          <div className="mt-6 space-y-4 text-base text-secondary leading-relaxed">
            <p>
              Most tax software uses fuzzy heuristics designed to push you into their highest tier at the
              first sign of complexity. If you enter \$200 from a side gig, they flag an "urgent business
              situation" and demand \$120.
            </p>
            <p>
              TaxWise takes the opposite approach. We map your tax documents strictly against IRS schedule
              specifications. If your freelance income can be satisfied on a \$49 tier with Schedule C, we
              explicitly block upselling to the \$149 Corporate tier.
            </p>
          </div>

          <div className="mt-8 space-y-2.5">
            <div className="flex items-start gap-2.5 text-sm text-primary">
              <Check className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
              <span><strong>Standard Deduction Protection:</strong> Won&apos;t charge you for Schedule A if itemizing loses you money.</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-primary">
              <Check className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
              <span><strong>100% In-Memory Execution:</strong> Evaluated inside your browser session without storing financials on our servers.</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 text-sm font-bold text-trust hover:underline"
            >
              <span>Test your tax scenario now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
