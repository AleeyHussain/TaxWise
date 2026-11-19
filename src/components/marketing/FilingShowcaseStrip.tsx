"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, TrendingUp, Building2, ShieldCheck, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface Persona {
  id: string;
  tabLabel: string;
  icon: typeof User;
  headline: string;
  description: string;
  forms: string[];
  plan: string;
  price: string;
  trap: string;
  benefit: string;
}

const PERSONAS: Persona[] = [
  {
    id: "w2-simple",
    tabLabel: "W-2 Single / Family",
    icon: User,
    headline: "W-2 Wage Filer with Standard Deduction",
    description: "Employment income with student loan interest, child tax credit, or retirement contributions.",
    forms: ["Form 1040", "Schedule 1", "Schedule 8812"],
    plan: "TaxWise Free",
    price: "$0.00",
    trap: "Competitors charge $39 to $89 as soon as you enter student loan interest or HSA data.",
    benefit: "100% free federal and state matching when within statutory standard thresholds.",
  },
  {
    id: "freelancer",
    tabLabel: "1099 / Freelancer",
    icon: Briefcase,
    headline: "Contractor, Creator, or Sole Proprietor",
    description: "1099-NEC/K income with home office deductions, mileage, software expenses, and SE tax.",
    forms: ["Schedule C", "Schedule SE", "Form 8829"],
    plan: "Self-Employed",
    price: "$49.99",
    trap: "Major commercial suites demand $129+ plus an extra $64 per state return for Schedule C.",
    benefit: "Includes complete expense categorization and vehicle write-off at a single flat price.",
  },
  {
    id: "investor",
    tabLabel: "Investor / Crypto",
    icon: TrendingUp,
    headline: "Stock Trader, Crypto Filer, or Landlord",
    description: "Brokerage 1099-B sales, dividend income, crypto disposals, or residential rental income.",
    forms: ["Schedule D", "Form 8949", "Schedule E"],
    plan: "Deluxe Tier",
    price: "$29.99",
    trap: "Pushed into $90+ 'Premier' tiers with artificial caps on transaction import limits.",
    benefit: "Full cost-basis reconciliation and rental depreciation without hidden transaction fees.",
  },
  {
    id: "corporate",
    tabLabel: "LLC / S-Corporation",
    icon: Building2,
    headline: "Multi-Member LLC or S-Corp Entity",
    description: "Pass-through corporate entities filing Form 1120-S or 1065, requiring K-1 generation.",
    forms: ["Form 1120-S", "Schedule K-1", "Form 4562"],
    plan: "Corporate Tier",
    price: "$149.99",
    trap: "CPAs and legacy software frequently bill $400 to $1,200 for corporate entity tax returns.",
    benefit: "Structured pass-through workflow matching officer compensation and expense schedules.",
  },
];

export default function FilingShowcaseStrip() {
  const [activeTab, setActiveTab] = useState("freelancer");
  const current = PERSONAS.find((p) => p.id === activeTab) || PERSONAS[0];
  const Icon = current.icon;

  return (
    <section className="container-px py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-10">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cta">
          Interactive Scenario Explorer
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl mt-2 font-display">
          Pick your filing profile. See the zero-upsell math.
        </h2>
        <p className="mt-3 text-secondary text-base leading-relaxed">
          How TaxWise matches real taxpayers against actual IRS requirements without artificial tier traps.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {PERSONAS.map((p) => {
          const PIcon = p.icon;
          const isActive = p.id === activeTab;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveTab(p.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-150 ${
                isActive
                  ? "bg-accent-primary text-white shadow-md scale-[1.02]"
                  : "bg-surface border border-border-subtle text-secondary hover:text-primary hover:border-border-strong"
              }`}
            >
              <PIcon className="h-4 w-4" />
              <span>{p.tabLabel}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border border-border-strong glass-3 p-6 sm:p-10 shadow-2xl relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-base border border-border-subtle text-accent-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider">
                  Profile Specification
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-primary tracking-tight font-display">
                {current.headline}
              </h3>
              <p className="mt-2 text-sm text-secondary leading-relaxed">{current.description}</p>
              <div className="mt-5">
                <span className="font-mono text-[11px] font-bold text-tertiary uppercase tracking-wider block mb-2">
                  Required IRS Schedules:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.forms.map((f) => (
                    <span key={f} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-base border border-border-subtle text-primary font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/5 p-4 text-xs sm:text-sm text-secondary">
                <strong className="text-danger font-bold block mb-1">The Commercial Upsell Trap:</strong>
                {current.trap}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-accent-success/40 bg-base/80 p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-accent-success uppercase tracking-wider">
                  Optimal Match
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-primary font-display">{current.plan}</span>
                  <span className="font-mono text-2xl font-extrabold text-accent-success">{current.price}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border-subtle text-xs text-secondary leading-relaxed space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
                    <span>{current.benefit}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
                    <span>Statutory deduction limits verified line-by-line.</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <Link
                  href="/recommend"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent-cta px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-accent-cta-hover transition-colors"
                >
                  <span>Launch Questionnaire For This Tier</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
