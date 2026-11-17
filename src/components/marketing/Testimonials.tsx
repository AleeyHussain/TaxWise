"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import AvatarTeal from "@/components/illustrations/avatars/AvatarTeal";
import AvatarAmber from "@/components/illustrations/avatars/AvatarAmber";
import AvatarPurple from "@/components/illustrations/avatars/AvatarPurple";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  return (
    <section className="container-px py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
          Loved by filers who actually finished.
        </h2>
        <p className="mt-3 text-secondary text-base leading-relaxed">
          Real feedback from independent filers who found their match with clear reasoning, not upselling.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        {/* Featured Testimonial Card (Left, 2-column span, glass-3) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="lg:col-span-2 glass-3 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl"
        >
          <div>
            {/* 5-star rating in accent-premium */}
            <div className="flex items-center gap-1.5 text-accent-premium mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>

            {/* Featured Quote */}
            <blockquote className="text-xl sm:text-2xl font-medium text-primary leading-relaxed">
              &ldquo;I always picked the wrong plan. TaxWise said &lsquo;Self-Employed&rsquo; and explained why. That&rsquo;s never happened before.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-secondary leading-relaxed">
              Having the specific reasoning listed line-by-line meant I didn&rsquo;t have to second-guess my deductible expenses or worry about an audit.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border-subtle flex items-center gap-4">
            <AvatarTeal size={48} className="rounded-full shadow-md" />
            <div>
              <div className="font-bold text-primary text-base">Maya R.</div>
              <div className="text-sm text-secondary">Freelance Designer</div>
            </div>
          </div>
        </motion.div>

        {/* Stacked Cards on Right (1-column span, glass-2) */}
        <div className="flex flex-col gap-6 lg:col-span-1 justify-between">
          {/* Card 2: Devon K. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: EXPO_OUT }}
            className="glass-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 shadow-lg"
          >
            <div>
              <div className="flex items-center gap-1 text-accent-premium mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base font-medium text-primary leading-snug">
                &ldquo;Took me two minutes. Saved me from buying the wrong tier. The reasoning is the part I actually trust.&rdquo;
              </blockquote>
            </div>

            <div className="mt-5 pt-4 border-t border-border-subtle flex items-center gap-3">
              <AvatarAmber size={40} className="rounded-full shadow-sm" />
              <div>
                <div className="font-bold text-primary text-sm">Devon K.</div>
                <div className="text-xs text-secondary">First-time Filer</div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Priya S. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.16, ease: EXPO_OUT }}
            className="glass-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between flex-1 shadow-lg"
          >
            <div>
              <div className="flex items-center gap-1 text-accent-premium mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base font-medium text-primary leading-snug">
                &ldquo;The assistant answered a question my accountant charged me $80 to explain badly.&rdquo;
              </blockquote>
            </div>

            <div className="mt-5 pt-4 border-t border-border-subtle flex items-center gap-3">
              <AvatarPurple size={40} className="rounded-full shadow-sm" />
              <div>
                <div className="font-bold text-primary text-sm">Priya S.</div>
                <div className="text-xs text-secondary">Small Business Owner</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
