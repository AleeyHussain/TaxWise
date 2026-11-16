import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        border: "var(--border-color)",
        trust: {
          DEFAULT: "var(--trust-primary)",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "var(--trust-primary)",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        structure: "var(--structure-gray)",
        ai: {
          DEFAULT: "var(--ai-accent)",
          accent: "var(--ai-accent)",
        },
        success: "var(--success-color)",
        premium: "var(--premium-color)",
        cta: {
          DEFAULT: "var(--cta-color)",
          hover: "#c2410c",
        },
        warning: "var(--warning-color)",
        danger: "var(--danger-color)",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1e3a8a",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#172554",
          950: "#0f172a",
        },
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
