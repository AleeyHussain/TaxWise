"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon, SparkleIcon, CheckIcon } from "@/components/icons";
import AnimatedCounter from "./AnimatedCounter";

const EASING = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
    >
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        aria-hidden="true"
      >
        <svg
          className="absolute left-1/2 top-0 h-[640px] w-[1000px] -translate-x-1/2 stroke-slate-200/80 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)] dark:stroke-slate-800/80"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-pattern)" />
        </svg>
      </motion.div>

      <div className="container-px py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0, ease: EASING }}
          >
            <span className="badge badge-brand mx-auto mb-6 py-1 px-3.5 shadow-xs">
              <SparkleIcon className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
              AI-guided · Rules-backed · 4.9★ from 12,000 filers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: EASING }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white"
          >
            The tax plan that actually fits your life.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASING }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Answer five questions. Get a plan matched to your income, deductions,
            and how much help you want — with the reasoning spelled out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASING }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <Link
              href="/recommend"
              className="btn btn-cta btn-lg shadow-md hover:shadow-lg focus:ring-orange-500"
            >
              Find my plan
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/compare"
              className="btn btn-secondary btn-lg"
            >
              Compare all plans
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EASING }}
            className="mt-4 text-sm text-slate-500 dark:text-slate-400"
          >
            or{" "}
            <Link href="/assistant" className="link font-medium text-slate-700 dark:text-slate-200">
              ask the assistant
            </Link>{" "}
            a question.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 pt-8 text-center dark:divide-slate-800 dark:border-slate-800"
          >
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="flex items-center gap-1">
                  <AnimatedCounter value={2} suffix=" min" />
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">To match your plan</p>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>No sign-up</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Anonymous & instant</p>
            </div>
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>GDPR-friendly</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Zero data retention</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
