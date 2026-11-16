"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    title: "Tell us about your year",
    body: "Answer five questions about your income, deductions, and how much live tax expert guidance you want.",
  },
  {
    title: "We match the rules",
    body: "A deterministic rules engine matches your answers against each plan's supported schedules and picks the optimal fit.",
  },
  {
    title: "See your recommendation",
    body: "Get a clear recommendation with the exact reasons behind it, warnings for unsupported edge cases, and upgrade paths.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 md:py-24 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="container-px">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Transparent matching in three simple steps.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card card-hover p-6 sm:p-7"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
