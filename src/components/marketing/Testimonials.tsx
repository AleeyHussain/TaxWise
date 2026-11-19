"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import AvatarTeal from "@/components/illustrations/avatars/AvatarTeal";
import AvatarAmber from "@/components/illustrations/avatars/AvatarAmber";
import AvatarPurple from "@/components/illustrations/avatars/AvatarPurple";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  return (
    <section id="testimonials" className="container-px py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-default bg-elevated/40 text-xs font-mono text-secondary mb-3">
          <span>STATUTORY GROUNDING &amp; FILER EVIDENCE</span>
        </div>
        <h2
          style={{ color: "var(--text-primary)" }}
          className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl"
        >
          Verified by filers who refused to be up-sold.
        </h2>
        <p
          style={{ color: "var(--text-secondary)" }}
          className="mt-3 text-secondary text-base leading-relaxed max-w-2xl mx-auto"
        >
          Field notes from independent workers and multi-schedule filers who found their exact tier with statutory reasoning, not artificial sales gates.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        {/* Featured Case Study (Maya R.) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="lg:col-span-2 glass-3 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl border border-border-default"
        >
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-accent-premium">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="font-mono text-xs text-accent px-2.5 py-1 rounded-md border border-border-subtle bg-elevated/60">
                SCHEDULE C · FORM 8829
              </span>
            </div>

            <blockquote
              style={{ color: "var(--text-primary)" }}
              className="text-xl sm:text-2xl font-bold text-primary leading-snug"
            >
              &ldquo;Every other platform pushed me into their \$130 plan the minute I had a 1099-NEC. TaxWise verified I qualified for Self-Employed with Schedule C deductions and clearly showed the IRS reason.&rdquo;
            </blockquote>

            <p
              style={{ color: "var(--text-secondary)" }}
              className="mt-4 text-sm sm:text-[15px] text-secondary leading-relaxed font-normal"
            >
              Having the specific reasoning listed line-by-line meant I didn&rsquo;t have to second-guess deductible home office expenses or fear arbitrary audit flags. [TODO: Replace with real cohort data]
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle flex items-center gap-4">
            <AvatarTeal size={48} className="rounded-full shadow-md shrink-0" />
            <div>
              <div style={{ color: "var(--text-primary)" }} className="font-bold text-primary text-base">
                Maya R.
              </div>
              <div style={{ color: "var(--text-secondary)" }} className="text-xs sm:text-sm text-secondary font-medium">
                Independent Designer · Brooklyn, NY
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stacked Right Column */}
        <div className="flex flex-col gap-6 lg:col-span-1 justify-between">
          {/* Card 2: Devon K. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: EXPO_OUT }}
            className="glass-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 shadow-lg border border-border-default"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 text-accent-premium">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-accent px-2 py-0.5 rounded border border-border-subtle bg-elevated/60">
                  SCHEDULE D · 1099-B
                </span>
              </div>

              <blockquote
                style={{ color: "var(--text-primary)" }}
                className="text-sm sm:text-[15px] font-semibold text-primary leading-snug"
              >
                &ldquo;Took two minutes to audit my capital loss carryover. Kept me on the Deluxe tier without forced enterprise upsells. The statutory reasoning is what I actually trust.&rdquo;
              </blockquote>

              <p
                style={{ color: "var(--text-secondary)" }}
                className="mt-2 text-xs text-secondary leading-relaxed"
              >
                Zero popups asking to add audit insurance. [TODO: Replace with real user metric]
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border-subtle flex items-center gap-3">
              <AvatarAmber size={40} className="rounded-full shadow-sm shrink-0" />
              <div>
                <div style={{ color: "var(--text-primary)" }} className="font-bold text-primary text-sm">
                  Devon K.
                </div>
                <div style={{ color: "var(--text-secondary)" }} className="text-xs text-secondary font-medium">
                  First-time Filer · Chicago, IL
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Priya S. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.16, ease: EXPO_OUT }}
            className="glass-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 shadow-lg border border-border-default"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 text-accent-premium">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-accent px-2 py-0.5 rounded border border-border-subtle bg-elevated/60">
                  FORM 1120-S · PASS-THROUGH
                </span>
              </div>

              <blockquote
                style={{ color: "var(--text-primary)" }}
                className="text-sm sm:text-[15px] font-semibold text-primary leading-snug"
              >
                &ldquo;The assistant answered statutory pass-through entity deduction questions in seconds. Saved hours of CPA consulting fees.&rdquo;
              </blockquote>

              <p
                style={{ color: "var(--text-secondary)" }}
                className="mt-2 text-xs text-secondary leading-relaxed"
              >
                Backed by IRC §199A guidelines directly. [TODO: Replace with real data]
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-border-subtle flex items-center gap-3">
              <AvatarPurple size={40} className="rounded-full shadow-sm shrink-0" />
              <div>
                <div style={{ color: "var(--text-primary)" }} className="font-bold text-primary text-sm">
                  Priya S.
                </div>
                <div style={{ color: "var(--text-secondary)" }} className="text-xs text-secondary font-medium">
                  Studio Lead · Austin, TX
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
