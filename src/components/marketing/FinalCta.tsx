"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Terminal, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function FinalCta() {
  return (
    <section className="container-px pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EXPO_OUT }}
        className="relative overflow-hidden rounded-3xl border border-border-default bg-surface/85 backdrop-blur-xl p-8 sm:p-14 shadow-2xl"
      >
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border-subtle bg-elevated/80 font-mono text-xs text-accent-primary mb-4">
              <Terminal className="h-3.5 w-3.5" />
              <span>TERMINAL SPEC: DETERMINISTIC MATCH</span>
            </div>
            
            <h2
              style={{ color: "var(--text-primary)" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary leading-tight font-display"
            >
              Never overpay for tax software again.
            </h2>
            
            <p
              style={{ color: "var(--text-secondary)" }}
              className="mt-4 text-secondary text-base sm:text-lg leading-relaxed"
            >
              Five questions. Zero upsells. Complete statutory justification for every schedule you actually need.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-secondary">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent-success" />
                <span>Zero server persistence</span>
              </span>
              <span>·</span>
              <span>100% Anonymous intake</span>
              <span>·</span>
              <span>IRS Rev. Proc. 2024-34</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button asChild variant="cta" size="lg" className="shadow-lg hover:shadow-xl font-bold">
              <Link href="/recommend" className="flex items-center justify-center gap-2">
                <span>Find my tier in 2 mins</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="secondary" size="lg" className="border-border-default">
              <Link href="/products" className="flex items-center justify-center gap-2 text-primary">
                <span>Inspect all 8 tiers</span>
                <ArrowUpRight className="h-4 w-4 text-secondary" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
