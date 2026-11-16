"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "I used to spend hours comparing TurboTax and H&R Block tiers. TaxWise matched my freelancing and ETF dividends to Self-Employed in two minutes flat.",
    author: "Elena Rostova",
    role: "Freelance UI Designer",
    rating: 5,
    initials: "ER",
  },
  {
    quote:
      "When we incorporated our design studio last autumn, we were terrified of misfiling. The corporate recommendations gave us crystal clarity on what forms we actually needed.",
    author: "Marcus Chen",
    role: "Co-Founder, Studio Chen",
    rating: 5,
    initials: "MC",
  },
  {
    quote:
      "The expert assist upgrade was worth every penny. Being able to ask questions about my rental deductions without buying a whole new plan saved me over $300.",
    author: "Sarah Jenkins",
    role: "Property Owner & Educator",
    rating: 5,
    initials: "SJ",
  },
];

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="container-px py-16 md:py-24 border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Trusted by thousands of independent filers
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Real feedback from filers who found their match without upselling.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className="card card-hover flex flex-col justify-between p-6 sm:p-7"
          >
            <div>
              <div className="flex gap-1 text-amber-500" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t.author}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
