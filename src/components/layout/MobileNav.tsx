"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/recommend", label: "Find my plan" },
  { href: "/assistant", label: "Assistant" },
];

export default function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!isOpen) return null;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950 animate-fade-in">
      <div className="container-px flex flex-col py-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
              isActive(item.href)
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
