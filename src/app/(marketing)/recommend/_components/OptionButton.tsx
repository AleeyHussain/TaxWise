"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function OptionButton({
  selected,
  label,
  hint,
  onClick,
  multi,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`group relative flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 min-h-[52px] backdrop-blur-md ${
        selected
          ? "border-trust bg-trust/10 ring-2 ring-trust/30 shadow-md"
          : "border-subtle bg-surface/75 hover:border-trust/40 hover:bg-surface hover:shadow-sm"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all duration-200 ${
          multi ? "rounded-lg" : "rounded-full"
        } ${
          selected
            ? "border-trust bg-trust text-white shadow-xs scale-105"
            : "border-subtle bg-elevated/80 group-hover:border-trust/60"
        }`}
      >
        {selected && <Check className="h-3 w-3 stroke-[3]" />}
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-primary group-hover:text-trust transition-colors">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-xs sm:text-sm text-secondary leading-relaxed">
            {hint}
          </span>
        )}
      </span>
    </motion.button>
  );
}
