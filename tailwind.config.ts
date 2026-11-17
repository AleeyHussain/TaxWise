import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Step 3 tokens
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        overlay: "var(--bg-overlay)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-primary-hover)",
          glow: "var(--accent-primary-glow)",
          ai: "var(--accent-ai)",
          "ai-hover": "var(--accent-ai-hover)",
          success: "var(--accent-success)",
          premium: "var(--accent-premium)",
          cta: "var(--accent-cta)",
          "cta-hover": "var(--accent-cta-hover)",
        },

        // Legacy compatibility mappings
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-overlay": "var(--bg-overlay)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "border-subtle": "var(--border-subtle)",
        trust: {
          DEFAULT: "var(--accent-primary)",
          600: "var(--accent-primary)",
        },
        ai: {
          DEFAULT: "var(--accent-ai)",
          accent: "var(--accent-ai)",
        },
        success: "var(--accent-success)",
        premium: "var(--accent-premium)",
        cta: {
          DEFAULT: "var(--accent-cta)",
          hover: "var(--accent-cta-hover)",
        },
        warning: "var(--accent-premium)",
        danger: "var(--danger, #DC2626)",
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
