"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";

export default function FinalCta() {
  return (
    <section className="container-px pb-20 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="card flex flex-col items-center gap-4 bg-gradient-to-br from-blue-900 to-slate-900 p-10 sm:p-14 text-center text-white shadow-xl"
      >
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
          Ready to find your plan?
        </h2>
        <p className="max-w-xl text-slate-200 text-sm sm:text-base leading-relaxed">
          It takes about two minutes. You can restart anytime, explore scenarios, and nothing is saved to a server.
        </p>
        <Link
          href="/recommend"
          className="btn btn-cta btn-lg shadow-lg hover:shadow-xl mt-3"
        >
          Start the questionnaire
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
