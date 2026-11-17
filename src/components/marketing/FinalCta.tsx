"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const EXPO_OUT = [0.22, 1, 0.36, 1] as const;

export default function FinalCta() {
  return (
    <section className="container-px pb-20 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EXPO_OUT }}
        className="card flex flex-col items-center gap-4 bg-gradient-to-br from-trust via-blue-900 to-base p-10 sm:p-14 text-center text-white shadow-xl border-trust/30"
      >
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
          Ready to find your plan?
        </h2>
        <p className="max-w-xl text-blue-100 text-sm sm:text-base leading-relaxed">
          It takes about two minutes. You can restart anytime, explore scenarios, and nothing is saved to a server.
        </p>
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ y: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="mt-3"
        >
          <Button asChild variant="cta" size="lg" className="shadow-lg hover:shadow-xl">
            <Link href="/recommend">
              Start the questionnaire
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
