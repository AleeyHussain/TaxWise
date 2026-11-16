"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <nav className="hidden items-center gap-1 md:flex">
      <Link
        href="/"
        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive("/")
            ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        Home
      </Link>
      <NavDropdown />
      {NAV_LINKS.slice(1).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
