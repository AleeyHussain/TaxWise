"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useScroll, useMotionValueEvent, useSpring, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { Search } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPast100, setIsPast100] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
    setIsPast100(latest > 100);
  });

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[height,background-color,border-color] duration-200 ease-out ${
        isScrolled
          ? "h-12 bg-surface/80 backdrop-blur-md border-b border-subtle shadow-xs"
          : "h-16 bg-transparent"
      }`}
    >
      <div className="container-px flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-primary transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="relative flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="TaxWise logo"
              width={isScrolled ? 26 : 30}
              height={isScrolled ? 26 : 30}
              className="transition-all duration-200"
              priority
            />
          </span>
          <span
            className={`font-display tracking-tight transition-all duration-200 ${
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-elevated px-2.5 py-1.5 text-xs text-secondary hover:text-primary transition-colors focus-visible:outline-none"
            aria-label="Search or jump to page"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-surface border border-subtle px-1 py-0.5 text-[10px] font-semibold text-secondary shadow-xs">
              ⌘K
            </kbd>
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

      {/* 2px Scroll progress bar pinned to the bottom edge */}
      <motion.div
        style={{ scaleX }}
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-trust via-ai to-success origin-left transition-opacity duration-200 ${
          isPast100 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
