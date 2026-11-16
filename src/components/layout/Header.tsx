"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { SparkleIcon } from "@/components/icons";
import { useScrolled, useScrollProgress } from "@/hooks/useScrollProgress";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrolled = useScrolled(80);
  const scrollProgress = useScrollProgress();

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-50 h-[2px] bg-blue-600 transition-opacity duration-300 ${
          scrollProgress > 2 ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
      <header
        className={`sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/80 ${
          isScrolled ? "h-12 shadow-sm" : "h-16"
        }`}
      >
        <div className="container-px flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900 transition-transform duration-200 dark:text-white"
          >
            <span
              className={`flex items-center justify-center rounded-lg bg-brand-600 text-white transition-all ${
                isScrolled ? "h-7 w-7" : "h-8 w-8"
              }`}
            >
              <SparkleIcon className={isScrolled ? "h-4 w-4" : "h-5 w-5"} />
            </span>
            <span className={isScrolled ? "text-base font-bold" : "text-lg font-bold"}>
              TaxWise
            </span>
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="btn btn-secondary btn-sm md:hidden"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              Menu
            </button>
          </div>
        </div>

        <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
    </>
  );
}
