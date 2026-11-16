"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const parallaxY = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b border-subtle bg-base"
    >
      {/* Background with radial gradient and scroll parallax */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.12),rgba(255,255,255,0))]" />
      
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        aria-hidden="true"
      >
        <svg
          className="absolute left-1/2 top-0 h-[700px] w-[1100px] -translate-x-1/2 stroke-subtle [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M0 48L48 0H24L0 24M48 48V24L24 48" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-grid)" />
        </svg>
      </motion.div>

      <div className="container-px py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0, ease: EXPO_OUT }}
          >
            <span className="badge badge-brand mx-auto mb-6 py-1 px-3.5 shadow-xs border border-subtle">
              <Sparkles className="h-3.5 w-3.5 text-trust" />
              AI-guided · Rules-backed · 4.9★ from 12,000 filers
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06, ease: EXPO_OUT }}
            className="text-4xl font-extrabold tracking-tight text-primary sm:text-6xl"
          >
            The tax plan that actually fits your life.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EXPO_OUT }}
            className="mx-auto mt-6 max-w-2xl text-lg text-secondary leading-relaxed"
          >
            Answer five questions. Get a plan matched to your income, deductions,
            and how much help you want — with the reasoning spelled out.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EXPO_OUT }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href="/recommend"
                className="btn btn-cta btn-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Find my plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href="/compare"
                className="btn btn-secondary btn-lg"
              >
                Compare all plans
              </Link>
            </motion.div>
          </motion.div>

          {/* Tertiary link */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: EXPO_OUT }}
            className="mt-5 text-sm text-secondary"
          >
            or{" "}
            <Link href="/assistant" className="link font-medium">
              ask the assistant
            </Link>{" "}
            a question.
          </motion.p>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: EXPO_OUT }}
            className="mt-14 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-subtle border-t border-subtle pt-8 text-center"
          >
            <div className="py-3 sm:py-0 px-3">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="flex items-center gap-1">
                  <AnimatedCounter value={2341} /> filers
                </span>
              </div>
              <p className="mt-1 text-xs text-secondary">Matched this month</p>
            </div>

            <div className="py-3 sm:py-0 px-3">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary">
                <Clock className="h-4 w-4 text-success" />
                <span className="flex items-center gap-1">
                  <AnimatedCounter value={2} suffix=" min" /> average
                </span>
              </div>
              <p className="mt-1 text-xs text-secondary">Instant questionnaire</p>
            </div>

            <div className="py-3 sm:py-0 px-3">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-primary">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Zero retention</span>
              </div>
              <p className="mt-1 text-xs text-secondary">100% client anonymous</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
