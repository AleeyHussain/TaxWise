"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { products } from "@/features/products/catalogue";
import { formatPrice } from "@/lib/format";
import { ChevronDown, User, Briefcase, Sparkles, Building2 } from "lucide-react";
import type { ProductCategory } from "@/types";

const CATEGORY_ICONS: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  personal: User,
  "self-employed": Briefcase,
  expert: Sparkles,
  corporate: Building2,
};

export default function NavDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors focus-visible:outline-none"
          aria-expanded={open}
        >
          <span>Products</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              open ? "rotate-180 text-trust" : "text-secondary group-hover:text-primary"
            }`}
          />
          <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 bg-trust transition-transform duration-180 origin-left group-hover:scale-x-100" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="start"
          className="z-[100] w-[420px] rounded-2xl border border-border-strong bg-surface p-3 shadow-2xl backdrop-blur-md animate-fade-in"
        >
          <div className="grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto pr-1">
            {products.map((p) => {
              const Icon = CATEGORY_ICONS[p.category] || Sparkles;
              return (
                <DropdownMenu.Item key={p.id} asChild>
                  <Link
                    href={`/products#${p.id}`}
                    onClick={() => setOpen(false)}
                    className="group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-150 hover:bg-elevated focus:bg-elevated focus:outline-none"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base border border-subtle text-trust group-hover:border-trust/40">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary group-hover:text-trust transition-colors">
                          {p.name}
                        </span>
                        <span className="text-xs font-bold text-success">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-secondary truncate">
                        {p.tagline}
                      </p>
                    </div>
                  </Link>
                </DropdownMenu.Item>
              );
            })}
          </div>

          <div className="mt-2 border-t border-subtle pt-2">
            <Link
              href="/compare"
              onClick={() => setOpen(false)}
              className="block rounded-lg p-2 text-center text-xs font-semibold text-trust hover:bg-elevated transition-colors"
            >
              Compare all 8 plans side-by-side &rarr;
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
