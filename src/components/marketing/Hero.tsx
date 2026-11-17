"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import FloatingMathBackground from "./FloatingMathBackground";
import { Button } from "@/components/ui/Button";
import { BotFaceSVG } from "@/components/BotCursor";
import HeroFloatingShapes from "./HeroFloatingShapes";
import HeroMockupCard from "./HeroMockupCard";
import HeroIllustration from "@/components/illustrations/HeroIllustration";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

function H1Sparkle() {
  return (
    <motion.span
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block text-accent-ai align-middle mx-1 w-[0.6em] h-[0.6em]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </motion.span>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-subtle bg-base">
      <FloatingMathBackground />
      <HeroFloatingShapes />

      <div className="container-px py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, CTAs, Bot Card, Metrics */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: EXPO_OUT }}
            >
              <span className="badge badge-brand mb-6 py-1 px-3.5 shadow-xs border border-subtle inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-trust" />
                AI-guided · Rules-backed · 4.9★ from 12,000 filers
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: EXPO_OUT }}
              className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl leading-[1.1]"
            >
              The tax plan that actually<H1Sparkle /> fits<H1Sparkle /> your life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EXPO_OUT }}
              className="mt-6 text-base sm:text-lg text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Answer five questions. Get a plan matched to your income, deductions,
              and how much help you want — with the reasoning spelled out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: EXPO_OUT }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5"
            >
              <Button asChild variant="cta" size="lg" className="shadow-lg hover:shadow-xl">
                <Link href="/recommend">
                  Find my plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="shadow-sm hover:shadow-md">
                <Link href="/compare">Compare all plans</Link>
              </Button>
            </motion.div>

            {/* AI Bot helper card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: EXPO_OUT }}
              className="mt-6 inline-flex items-center gap-3 glass-2 rounded-2xl p-2.5 pr-4 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface/80 border border-border shadow-inner shrink-0">
                <BotFaceSVG size={36} />
              </div>
              <p className="text-xs text-secondary text-left">
                Your AI helper.{" "}
                <Link href="/assistant" className="font-semibold text-accent hover:underline">
                  Ask it anything &rarr;
                </Link>
              </p>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: EXPO_OUT }}
              className="mt-10 grid grid-cols-3 divide-x divide-subtle border-t border-subtle pt-6 text-center lg:text-left"
            >
              <div className="pr-3">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                  <CheckCircle2 className="h-4 w-4 text-accent-success shrink-0" />
                  <span className="truncate"><AnimatedCounter value={2341} /> filers</span>
                </div>
                <p className="mt-0.5 text-[11px] text-secondary">Matched this month</p>
              </div>
              <div className="px-3">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                  <Clock className="h-4 w-4 text-accent-success shrink-0" />
                  <span className="truncate"><AnimatedCounter value={2} suffix=" min" /></span>
                </div>
                <p className="mt-0.5 text-[11px] text-secondary">Instant questionnaire</p>
              </div>
              <div className="pl-3">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary">
                  <ShieldCheck className="h-4 w-4 text-accent-success shrink-0" />
                  <span className="truncate">Zero retention</span>
                </div>
                <p className="mt-0.5 text-[11px] text-secondary">Client anonymous</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Illustration & Product Mockup Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[420px] flex flex-col items-center">
              {/* SVG Transform Illustration */}
              <HeroIllustration className="w-full max-w-[340px] sm:max-w-[380px] h-auto drop-shadow-sm select-none" />
              {/* Product Mockup Overlay Card */}
              <div className="mt-[-60px] sm:mt-[-80px] w-full flex justify-center z-20">
                <HeroMockupCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
