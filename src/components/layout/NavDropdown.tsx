"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/features/products/catalogue";
import { formatPrice } from "@/lib/format";

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
    >
      <Link
        href="/products"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Products
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.95, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.95, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="absolute left-0 top-full z-50 mt-1 w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto pr-1">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/70"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                        {p.name}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 uppercase dark:bg-slate-800">
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 truncate dark:text-slate-400">
                      {p.tagline}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {formatPrice(p.price)}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
              <Link
                href="/compare"
                onClick={() => setOpen(false)}
                className="block rounded-lg p-2 text-center text-xs font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 transition"
              >
                Compare all 8 plans side-by-side &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
