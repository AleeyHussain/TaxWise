import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageShell from "@/components/layout/PageShell";
import { Toaster } from "sonner";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), { ssr: false });
const GlobalAssistantBot = dynamic(() => import("@/components/assistant/GlobalAssistantBot"), { ssr: false });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://taxwise.vercel.app"),
  title: "TaxWise — Deterministic Tax Plan Recommender",
  description:
    "Stop overpaying for tax software bundles. Deterministic filing tier matching for W-2, 1099, and LLC filers with transparent statutory reasoning.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TaxWise — Deterministic Tax Plan Recommender",
    description: "Stop overpaying for tax software bundles. Deterministic filing tier matching with transparent statutory reasoning.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaxWise — Deterministic Tax Plan Recommender",
    description: "Stop overpaying for tax software bundles. Deterministic filing tier matching with transparent statutory reasoning.",
    images: ["/twitter-card.png"],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);if(['dark','ocean','crimson','aurora'].indexOf(t)!==-1){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "TaxWise",
      "url": "https://tax-wise-nine.vercel.app",
      "description": "Deterministic tax plan matching engine for US personal and corporate filers.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    },
    {
      "@type": "Organization",
      "name": "TaxWise",
      "url": "https://tax-wise-nine.vercel.app"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans bg-base text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-trust focus:px-4 focus:py-2.5 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Header />
        <PageShell>{children}</PageShell>
        <Footer />
        <CommandPalette />
        <GlobalAssistantBot />
        <Toaster position="bottom-right" richColors theme="system" />
      </body>
    </html>
  );
}
