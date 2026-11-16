"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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
    >
      <Link
        href="/products"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Products
      </Link>

      {open && (
        <div className="absolute left-0 top-full z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
          <div className="space-y-1">
            {products.map((p) => (
              <Link
                key={p.id}
                href="/products"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                    {p.tagline}
                  </div>
                </div>
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {formatPrice(p.price)}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
            <Link
              href="/compare"
              onClick={() => setOpen(false)}
              className="block rounded-lg p-2 text-center text-xs font-medium text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/20"
            >
              Compare all plans &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
