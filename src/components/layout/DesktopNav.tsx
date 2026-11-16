"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavDropdown from "./NavDropdown";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "Compare" },
  { href: "/recommend", label: "Find my plan" },
  { href: "/assistant", label: "Assistant" },
];

export default function DesktopNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
      <Link
        href="/"
        className="group relative px-3 py-2 text-sm font-medium transition-colors"
      >
        {isActive("/") && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 rounded-lg bg-elevated border border-subtle"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <span
          className={`relative z-10 transition-colors ${
            isActive("/") ? "text-trust font-bold" : "text-secondary hover:text-primary"
          }`}
        >
          Home
        </span>
        <span className="absolute bottom-1 left-3 right-3 h-[2px] scale-x-0 bg-trust transition-transform duration-180 origin-left group-hover:scale-x-100" />
      </Link>

      <NavDropdown />

      {NAV_LINKS.slice(1).map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group relative px-3 py-2 text-sm font-medium transition-colors"
          >
            {active && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-lg bg-elevated border border-subtle"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                active ? "text-trust font-bold" : "text-secondary hover:text-primary"
              }`}
            >
              {item.label}
            </span>
            <span className="absolute bottom-1 left-3 right-3 h-[2px] scale-x-0 bg-trust transition-transform duration-180 origin-left group-hover:scale-x-100" />
          </Link>
        );
      })}
    </nav>
  );
}
