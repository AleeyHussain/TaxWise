"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MathItem {
  id: string;
  expr: string;
  sub?: string;
  top: string;
  left?: string;
  right?: string;
  duration: number;
  delay: number;
  floatY: number[];
  floatX: number[];
  color: string;
}

const MATH_OPERATIONS: MathItem[] = [
  {
    id: "m1",
    expr: "∑ (Income) − Deductions",
    sub: "= Taxable Net",
    top: "12%",
    left: "5%",
    duration: 9,
    delay: 0,
    floatY: [0, -18, 6, 0],
    floatX: [0, 12, -8, 0],
    color: "border-ai/40 text-ai bg-ai/5",
  },
  {
    id: "m2",
    expr: "Tax = Rate × Base − Credits",
    sub: "Optimal Tier",
    top: "22%",
    right: "6%",
    duration: 11,
    delay: 1.2,
    floatY: [0, 16, -14, 0],
    floatX: [0, -10, 14, 0],
    color: "border-trust/40 text-trust bg-trust/5",
  },
  {
    id: "m3",
    expr: "401(k) + IRA = Max",
    sub: "Deduction Guard",
    top: "62%",
    left: "4%",
    duration: 8.5,
    delay: 0.6,
    floatY: [0, -14, 12, 0],
    floatX: [0, 8, -6, 0],
    color: "border-success/40 text-success bg-success/5",
  },
  {
    id: "m4",
    expr: "Δ Bracket = 24% − 22%",
    sub: "Marginal Rate",
    top: "58%",
    right: "5%",
    duration: 10,
    delay: 2,
    floatY: [0, 18, -10, 0],
    floatX: [0, -12, 8, 0],
    color: "border-premium/40 text-premium bg-premium/5",
  },
  {
    id: "m5",
    expr: "W-2 + 1099-NEC = AGI",
    sub: "Multi-Source",
    top: "78%",
    left: "12%",
    duration: 12,
    delay: 1.5,
    floatY: [0, -12, 16, 0],
    floatX: [0, 10, -12, 0],
    color: "border-trust/30 text-secondary bg-surface/30",
  },
  {
    id: "m6",
    expr: "15% + 7.65% = 22.65%",
    sub: "Self-Employment",
    top: "80%",
    right: "12%",
    duration: 9.5,
    delay: 0.8,
    floatY: [0, 14, -16, 0],
    floatX: [0, -8, 10, 0],
    color: "border-ai/30 text-secondary bg-surface/30",
  },
];

const FLOATING_SYMBOLS = [
  { sym: "∑", top: "18%", left: "32%", d: 7, delay: 0 },
  { sym: "%", top: "28%", right: "30%", d: 8, delay: 1 },
  { sym: "÷", top: "42%", left: "18%", d: 6.5, delay: 0.5 },
  { sym: "×", top: "45%", right: "20%", d: 7.5, delay: 1.5 },
  { sym: "Δ", top: "70%", left: "28%", d: 9, delay: 2 },
  { sym: "+", top: "72%", right: "26%", d: 6, delay: 0.2 },
  { sym: "$", top: "35%", left: "8%", d: 8.5, delay: 1.8 },
  { sym: "≈", top: "38%", right: "10%", d: 10, delay: 0.7 },
];

export default function FloatingMathBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Moving Equation Badges */}
      {MATH_OPERATIONS.map((item) => (
        <motion.div
          key={item.id}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
          className="pointer-events-auto absolute hidden select-none md:block"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: item.floatY,
                  x: item.floatX,
                  rotate: [0, 2, -2, 0],
                }
          }
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: item.delay,
          }}
          whileHover={{ scale: 1.08, zIndex: 20 }}
        >
          <div
            className={`group flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 shadow-sm backdrop-blur-md transition-all duration-200 hover:shadow-lg ${item.color}`}
          >
            <span className="font-mono text-xs font-bold tracking-tight">
              {item.expr}
            </span>
            {item.sub && (
              <span className="rounded bg-elevated/80 px-1.5 py-0.5 text-[10px] font-semibold text-secondary opacity-80 group-hover:opacity-100">
                {item.sub}
              </span>
            )}
          </div>
        </motion.div>
      ))}

      {/* Ambient Floating Math Operators */}
      {FLOATING_SYMBOLS.map((s, idx) => (
        <motion.span
          key={idx}
          style={{ top: s.top, left: s.left, right: s.right }}
          className="absolute select-none font-mono text-xl font-extrabold text-secondary/20 dark:text-secondary/30"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -15, 10, 0],
                  scale: [1, 1.15, 0.95, 1],
                  opacity: [0.18, 0.38, 0.18],
                }
          }
          transition={{
            duration: s.d,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: s.delay,
          }}
        >
          {s.sym}
        </motion.span>
      ))}
    </div>
  );
}
