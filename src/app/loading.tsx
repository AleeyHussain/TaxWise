"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/branding/Logo";

export default function RootLoading() {
  return (
    <div className="container-px flex min-h-[60vh] flex-col items-center justify-center py-16">
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <Logo size={48} variant="full" />
        <p className="text-xs font-medium text-secondary animate-pulse">
          Loading TaxWise...
        </p>
      </motion.div>
    </div>
  );
}
