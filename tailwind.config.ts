import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "border-subtle": "var(--border-subtle)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        subtle: "var(--border-subtle)",
        trust: {
          DEFAULT: "var(--trust)",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "var(--trust)",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        ai: {
          DEFAULT: "var(--ai)",
          accent: "var(--ai)",
        },
        success: "var(--success)",
        premium: "var(--premium)",
        cta: {
          DEFAULT: "var(--cta)",
          hover: "#c2410c",
        },
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Cal Sans", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
