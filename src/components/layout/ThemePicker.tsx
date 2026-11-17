"use client";

import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

export type ThemeName = "light" | "dark" | "ocean" | "crimson" | "rose" | "aurora";

interface ThemeOption {
  id: ThemeName;
  name: string;
  gradient: string;
  primary: string;
  darkScheme: boolean;
}

const THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    gradient: "linear-gradient(135deg, #1E3A8A 0%, #EA580C 100%)",
    primary: "#1E3A8A",
    darkScheme: false,
  },
  {
    id: "dark",
    name: "Dark",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #FB923C 100%)",
    primary: "#60A5FA",
    darkScheme: true,
  },
  {
    id: "ocean",
    name: "Ocean",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #10B981 100%)",
    primary: "#06B6D4",
    darkScheme: true,
  },
  {
    id: "crimson",
    name: "Crimson",
    gradient: "linear-gradient(135deg, #DC2626 0%, #EAB308 100%)",
    primary: "#DC2626",
    darkScheme: true,
  },
  {
    id: "rose",
    name: "Rose",
    gradient: "linear-gradient(135deg, #DB2777 0%, #F43F5E 100%)",
    primary: "#DB2777",
    darkScheme: false,
  },
  {
    id: "aurora",
    name: "Aurora",
    gradient: "linear-gradient(135deg, #EC4899 0%, #06B6D4 100%)",
    primary: "#EC4899",
    darkScheme: true,
  },
];

export default function ThemePicker() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>("light");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as ThemeName) || "light";
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (name: ThemeName) => {
    setCurrentTheme(name);
    document.documentElement.setAttribute("data-theme", name);
    localStorage.setItem("theme", name);

    if (["dark", "ocean", "crimson", "aurora"].includes(name)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const activeOption = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 px-2.5 border border-border-subtle bg-surface/60 hover:bg-elevated"
          aria-label={`Current theme: ${activeOption.name}. Click to change theme.`}
        >
          <span
            className="h-4 w-4 rounded-full border border-white/20 shadow-xs shrink-0"
            style={{
              backgroundColor: mounted ? activeOption.primary : "var(--accent-primary)",
            }}
          />
          <span className="hidden sm:inline text-xs font-semibold text-primary capitalize">
            {mounted ? activeOption.name : "Theme"}
          </span>
          <ChevronDown className="h-3 w-3 text-secondary opacity-70" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          asChild
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="z-50 min-w-[200px] overflow-hidden rounded-2xl glass-3 p-1.5 shadow-2xl"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-secondary uppercase tracking-wider">
                  Color Theme
                </div>
                {THEMES.map((t) => {
                  const isActive = currentTheme === t.id;
                  return (
                    <DropdownMenu.Item
                      key={t.id}
                      onSelect={() => applyTheme(t.id)}
                      className="group flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-primary outline-none transition-colors hover:bg-elevated focus:bg-elevated"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-7 w-7 rounded-full border border-white/20 shadow-xs shrink-0"
                          style={{ background: t.gradient }}
                        />
                        <span className="text-sm">{t.name}</span>
                      </div>
                      {isActive && (
                        <Check className="h-4 w-4 text-accent shrink-0 ml-3" />
                      )}
                    </DropdownMenu.Item>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
