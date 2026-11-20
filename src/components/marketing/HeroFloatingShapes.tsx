"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function HeroFloatingShapes() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ y: parallaxY }}
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0 hidden md:block"
      aria-hidden="true"
    >
      {/* Shape 1: Top-left floating circle (60px) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-[8%] h-16 w-16 rounded-full bg-accent/5 blur-[1px]"
      />

      {/* Shape 2: Top-right floating rounded square (50px) */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 right-[12%] h-12 w-12 rounded-2xl bg-accent-ai/5 border border-accent-ai/15"
      />

      {/* Shape 3: Bottom-left subtle ring */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-[15%] h-10 w-10 rounded-full border border-accent/15"
      />

      {/* Shape 4: Bottom-right soft pill (70px) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 right-[18%] h-10 w-20 rounded-full bg-accent-cta/5 blur-[1px]"
      />
    </motion.div>
  );
}
