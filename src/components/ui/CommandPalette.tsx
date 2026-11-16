"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { products } from "@/features/products/catalogue";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    const handleCustomOpen = () => setOpen(true);
    window.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Menu" className="flex flex-col">
          <div className="flex items-center border-b border-slate-200 px-4 dark:border-slate-800">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Command.Input
              placeholder="Search plans, features, or jump to page..."
              className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              autoFocus
            />
            <kbd className="hidden sm:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching plans or pages found.
            </Command.Empty>

            <Command.Group
              heading="Quick Navigation"
              className="px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500"
            >
              <Command.Item
                onSelect={() => navigate("/recommend")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Find my plan (Questionnaire)</span>
                <span className="text-xs text-orange-600 dark:text-orange-400">Recommended</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/compare")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Compare all plans</span>
                <span className="text-xs text-slate-400">Side-by-side</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/products")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Browse catalog</span>
                <span className="text-xs text-slate-400">All 8 tiers</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/assistant")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Tax Assistant</span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400">AI Chat</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Tax Plans"
              className="mt-2 px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500"
            >
              {products.map((prod) => (
                <Command.Item
                  key={prod.id}
                  value={`${prod.name} ${prod.tagline} ${prod.bestFor}`}
                  onSelect={() => navigate(`/products#${prod.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{prod.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {prod.tagline}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ${prod.price}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
