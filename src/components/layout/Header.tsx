"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { useScrolled, useScrollProgress } from "@/hooks/useScrollProgress";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrolled = useScrolled(80);
  const isPast200 = useScrolled(200);
  const scrollProgress = useScrollProgress();

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-50 h-[2px] bg-blue-700 transition-opacity duration-300 ${
          isPast200 ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
      <header
        className={`sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/90 ${
          isScrolled ? "h-12 shadow-sm" : "h-16"
        }`}
      >
        <div className="container-px flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-slate-900 transition-transform duration-200 hover:scale-[1.02] dark:text-white"
          >
            <span className="relative flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="TaxWise logo"
                width={isScrolled ? 28 : 32}
                height={isScrolled ? 28 : 32}
                className="transition-all duration-200"
                priority
              />
            </span>
            <span
              className={`font-display tracking-tight transition-all ${
                isScrolled ? "text-lg font-bold" : "text-xl font-extrabold"
              }`}
            >
              TaxWise
            </span>
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              aria-label="Search or jump to page"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
              <kbd className="rounded bg-white px-1 py-0.5 text-[10px] font-semibold text-slate-400 shadow-xs dark:bg-slate-800 dark:text-slate-500">⌘K</kbd>
            </button>
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
