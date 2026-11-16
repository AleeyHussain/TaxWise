"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { products } from "@/features/products/catalogue";
import { Search } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-subtle bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Menu" className="flex flex-col">
          <div className="flex items-center border-b border-subtle px-4">
            <Search className="h-4 w-4 shrink-0 text-secondary" />
            <Command.Input
              placeholder="Search plans, features, or jump to page..."
              className="w-full bg-transparent px-3 py-3.5 text-sm text-primary placeholder:text-secondary focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-block rounded bg-elevated border border-subtle px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-secondary">
              No matching plans or pages found.
            </Command.Empty>

            <Command.Group
              heading="Quick Navigation"
              className="px-2 py-1.5 text-xs font-semibold text-secondary"
            >
              <Command.Item
                onSelect={() => navigate("/recommend")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
              >
                <span>Find my plan (Questionnaire)</span>
                <span className="text-xs font-semibold text-cta">Recommended</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/compare")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
              >
                <span>Compare all plans</span>
                <span className="text-xs text-secondary">Side-by-side</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/products")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
              >
                <span>Browse catalog</span>
                <span className="text-xs text-secondary">All 8 tiers</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate("/assistant")}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
              >
                <span>Tax Assistant</span>
                <span className="text-xs font-semibold text-ai">AI Chat</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Tax Plans"
              className="mt-2 px-2 py-1.5 text-xs font-semibold text-secondary"
            >
              {products.map((prod) => (
                <Command.Item
                  key={prod.id}
                  value={`${prod.name} ${prod.tagline} ${prod.bestFor}`}
                  onSelect={() => navigate(`/products#${prod.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-primary hover:bg-elevated transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{prod.name}</span>
                    <span className="text-xs text-secondary">
                      {prod.tagline}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-success">
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
