"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, FileCode2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import HeroFloatingShapes from "./HeroFloatingShapes";
import InteractiveHeroSimulator from "./InteractiveHeroSimulator";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-subtle bg-base">
      <HeroFloatingShapes />

      {/* Subtle Architectural Grid Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] select-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="container-px py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Value Arguments */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EXPO_OUT }}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1 mb-6 shadow-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cta" />
              <span className="font-mono text-[11px] font-semibold text-secondary uppercase tracking-widest">
                Tax Year 2026 Active · Zero Upsell Policy
              </span>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl leading-[1.08] max-w-[18ch] mx-auto lg:mx-0 font-display">
              Taxes are code. Stop letting software sell you fear.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-secondary leading-relaxed max-w-[62ch] mx-auto lg:mx-0">
              Commercial tax platforms push simple filers into $120+ bundles through artificial audit anxiety.
              TaxWise evaluates your actual filing forms—Form 1040, Schedule C, or Form 1120-S—giving you the
              statutory justification for every dollar.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <Button asChild variant="cta" size="lg" className="shadow-lg hover:shadow-xl font-bold">
                <Link href="/recommend">
                  Run 2-Minute Matcher
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="shadow-sm hover:shadow-md font-semibold">
                <Link href="/compare">Inspect Plan Matrix</Link>
              </Button>
            </div>

            {/* Technical Specification Strip — Solid, High-Contrast Cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EXPO_OUT }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-t border-border-subtle pt-6 text-left"
            >
              <div className="rounded-xl border border-border-default bg-surface p-4 shadow-xs hover:border-border-strong transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-primary/10 border border-accent-primary/25 shrink-0">
                    <Terminal className="h-3.5 w-3.5 text-accent-primary" />
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>DETERMINISTIC</span>
                </div>
                <p
                  style={{ color: "var(--text-secondary)" }}
                  className="mt-2 text-xs text-secondary leading-relaxed font-medium"
                >
                  Zero black-box AI guessing. Rules match strict IRS schedule thresholds.
                </p>
              </div>

              <div className="rounded-xl border border-border-default bg-surface p-4 shadow-xs hover:border-border-strong transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-cta/10 border border-accent-cta/25 shrink-0">
                    <FileCode2 className="h-3.5 w-3.5 text-accent-cta" />
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>IRS SCHEDULES</span>
                </div>
                <p
                  style={{ color: "var(--text-secondary)" }}
                  className="mt-2 text-xs text-secondary leading-relaxed font-medium"
                >
                  Complete mapping from Form 1040 simple to Form 1120-S corporate pass-through.
                </p>
              </div>

              <div className="rounded-xl border border-border-default bg-surface p-4 shadow-xs hover:border-border-strong transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-success/10 border border-accent-success/25 shrink-0">
                    <Lock className="h-3.5 w-3.5 text-accent-success" />
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>ANONYMOUS</span>
                </div>
                <p
                  style={{ color: "var(--text-secondary)" }}
                  className="mt-2 text-xs text-secondary leading-relaxed font-medium"
                >
                  In-memory browser evaluation. Your income data is never saved to a database.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Interactive Simulator Focal Point */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <InteractiveHeroSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
