import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://taxwise.vercel.app"),
  title: "TaxWise — The tax plan that actually fits your life",
  description:
    "Answer five questions. Get a plan matched to your income, deductions, and how much help you want — with the reasoning spelled out.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-card.png"],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);if(['dark','ocean','crimson','aurora'].indexOf(t)!==-1){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
