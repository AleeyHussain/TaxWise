"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = [
  {
    q: "How does the recommendation work?",
    a: "Your answers run through a deterministic rules engine. Corporate filings come first, then expert-help options, then self-employment, investments, common deductions, and finally a simple free return. The highest-priority rule that matches wins.",
  },
  {
    q: "Is this real tax advice?",
    a: "No. TaxWise only points you to a software plan based on the product rules. It is not tax, legal or financial advice. For your specific situation, talk to a qualified tax professional.",
  },
  {
    q: "Do I need an account to try it?",
    a: "No account needed. You can run the questionnaire, compare plans and ask the assistant without signing up.",
  },
  {
    q: "What can the assistant help with?",
    a: "Ask it product questions in plain language, like which plan fits salary and donations, or the difference between two plans. It answers from the same product data the rest of the site uses.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx));
  };

  return (
    <section className="container-px py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl text-center">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {FAQ.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium text-slate-900 dark:text-white min-h-[44px]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-item-${idx}`}
                >
                  <span className="text-sm sm:text-base font-semibold">{item.q}</span>
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
                      id={`faq-item-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.a}
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
