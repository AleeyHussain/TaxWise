"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRICING_FAQS = [
  {
    q: "Do I need to pay upfront?",
    a: "No upfront fees. You can freely explore recommendations, ask the assistant questions, and review plan feature comparisons before deciding to purchase or file.",
  },
  {
    q: "What's the refund policy?",
    a: "If your tax situation changes before you submit your return or if a higher tier doesn't support an unexpected schedule, we offer a 100% money-back satisfaction guarantee within 30 days.",
  },
  {
    q: "Can I switch plans mid-year?",
    a: "Yes. You can upgrade seamlessly at any time without re-entering previously imported tax slips or data. You only pay the prorated difference between the tiers.",
  },
];

export default function PricingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx));
  };

  return (
    <section className="container-px pb-16 pt-6">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl text-center">
          Pricing & Billing Questions
        </h3>
        <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
          Transparent pricing with zero hidden add-ons or surprise checkout fees.
        </p>

        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {PRICING_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium text-slate-900 dark:text-white min-h-[44px]"
                  aria-expanded={isOpen}
                  aria-controls={`pricing-faq-${idx}`}
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <span
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`pricing-faq-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
