"use client";

import Link from "next/link";
import { useState } from "react";
import { useScroll, useMotionValueEvent, useSpring, motion } from "framer-motion";
import ThemePicker from "./ThemePicker";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/branding/Logo";
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
      className={`sticky top-0 z-50 w-full transition-[height,background-color,border-color] duration-200 ease-out ${
        isScrolled
          ? "h-12 glass-3 border-b border-border-strong shadow-md"
          : "h-16 bg-transparent"
      }`}
    >
      <div className="container-px flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center transition-transform duration-200 hover:scale-[1.02]"
        >
          <Logo variant="full" size={isScrolled ? 28 : 32} />
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={openCommandPalette}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 text-xs text-secondary hover:text-primary"
            aria-label="Search or jump to page"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-surface border border-border-subtle px-1 py-0.5 text-[10px] font-semibold text-secondary shadow-xs">
              ⌘K
            </kbd>
          </Button>
          <ThemePicker />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            Menu
          </Button>
        </div>
      </div>

      {/* 2px Scroll progress bar pinned to the bottom edge */}
      <motion.div
        style={{ scaleX }}
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent-ai to-accent-success origin-left transition-opacity duration-200 ${
          isPast100 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
