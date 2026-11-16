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

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function HowItWorks() {
  return (
    <section className="border-y border-subtle bg-surface py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EXPO_OUT }}
        className="container-px"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-secondary">
            Transparent matching in three simple steps.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EXPO_OUT }}
              className="card card-hover p-6 sm:p-7"
            >
              <motion.span
                initial={{ scale: 0.8, rotate: -4 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-trust text-sm font-bold text-white shadow-xs"
              >
                {i + 1}
              </motion.span>
              <h3 className="mt-5 text-lg font-bold text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
