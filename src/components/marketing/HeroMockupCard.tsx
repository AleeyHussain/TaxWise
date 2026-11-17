"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function HeroMockupCard({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotate: shouldReduceMotion ? 0 : -2,
      }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EXPO_OUT }}
      className={`relative w-full max-w-[380px] glass-2 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-border-default/80 hover:rotate-0 transition-transform duration-300 ${className || ""}`}
    >
      {/* Header Badge & Confidence */}
      <div className="flex items-center justify-between gap-2">
        <span className="badge badge-ai py-0.5 px-2.5 text-xs font-bold">
          Recommended plan
        </span>
        <ConfidenceBadge confidence="high" />
      </div>

      {/* Plan Name & Price */}
      <div className="mt-4 flex items-baseline justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <h3 className="text-2xl font-extrabold text-primary">
            Self-Employed
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            For freelancers & contractors
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-accent-success">
            CAD $70
          </span>
        </div>
      </div>

      {/* Why this plan bullet list */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary">
          Why this plan
        </p>
        <ul className="mt-2 space-y-2 text-xs sm:text-sm text-primary">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
            <span>Covers T2125 business & freelance schedule</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-accent-success shrink-0 mt-0.5" />
            <span>Automates vehicle & home office deductions</span>
          </li>
        </ul>
      </div>

      {/* Fake link below card */}
      <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-xs font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-default">
          Or see all 8 plans
          <ArrowRight className="h-3 w-3" />
        </span>
        <span className="text-[11px] font-semibold text-accent-ai bg-accent-ai/10 px-2 py-0.5 rounded-full border border-accent-ai/20">
          Match #1
        </span>
      </div>
    </motion.div>
  );
}
