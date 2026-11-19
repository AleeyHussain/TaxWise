"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: "pricing" | "engine" | "privacy";
}

const FAQS: FaqItem[] = [
  {
    category: "pricing",
    q: "Why do legacy tax platforms charge $120+ for freelance 1099 income?",
    a: "Commercial tax giants bundle routine Schedule C reporting with expensive, unnecessary 'audit insurance' and corporate consulting add-ons. TaxWise separates statutory IRS schedule filing from marketing fluff, keeping independent contractor returns at a flat $49.99.",
  },
  {
    category: "pricing",
    q: "Do I need to pay anything before seeing my recommendation?",
    a: "No. You can run through the complete questionnaire, test different scenarios, inspect our 8-plan matrix, and read the line-by-line statutory reasoning 100% free with zero checkout gates.",
  },
  {
    category: "engine",
    q: "How does the deterministic rules engine work?",
    a: "Rather than using black-box statistical AI that can hallucinate tax advice, TaxWise evaluates your inputs against codified IRS schedule rules (Form 1040, Schedule 1, Schedule C, Schedule D, Form 1120-S) to determine the exact minimum viable tier required by law.",
  },
  {
    category: "engine",
    q: "What if I don't know whether to take the standard or itemized deduction?",
    a: "Our engine checks your reported state/local taxes, mortgage interest, and charitable gifts against the 2026 standard deduction thresholds ($15,000 single / $30,000 married). If itemizing on Schedule A yields less tax savings, it immediately flags this so you don't buy unnecessary software.",
  },
  {
    category: "privacy",
    q: "Is my personal financial information stored on your servers?",
    a: "No. The TaxWise recommender executes entirely in-memory inside your browser session. We do not ask for or store Social Security Numbers, banking details, or employer identification numbers.",
  },
  {
    category: "privacy",
    q: "Can I export my plan recommendation for my accountant or CPA?",
    a: "Yes. After completing the questionnaire, you can download a complete PDF summary detailing the recommended tier, supported tax forms, and the exact reasons behind the selection.",
  },
];

export default function UnifiedFaq() {
  const [filter, setFilter] = useState<"all" | "pricing" | "engine" | "privacy">("all");

  const filtered = filter === "all" ? FAQS : FAQS.filter((f) => f.category === filter);

  return (
    <section className="container-px py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-trust" />
            <span className="font-mono text-xs font-bold text-secondary uppercase tracking-wider">
              Answers & Verification
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-secondary text-base leading-relaxed">
            Transparent answers regarding our statutory matching logic, pricing, and zero-retention privacy.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Questions" },
              { id: "pricing", label: "Pricing & Billing" },
              { id: "engine", label: "IRS Rules Engine" },
              { id: "privacy", label: "Data & Privacy" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-accent-primary text-white shadow-xs"
                    : "bg-surface border border-border-subtle text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <Accordion.Root type="single" collapsible className="space-y-3">
          {filtered.map((faq, idx) => (
            <Accordion.Item
              key={faq.q}
              value={`faq-${idx}`}
              className="group rounded-2xl border border-border-subtle bg-surface/70 backdrop-blur-md transition-all duration-200 hover:border-trust/40 hover:shadow-md data-[state=open]:border-trust/60 data-[state=open]:bg-surface"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold text-primary transition-colors hover:text-trust focus-visible:outline-none min-h-[52px]">
                  <span className="text-base sm:text-lg font-bold text-primary group-hover:text-trust transition-colors">
                    {faq.q}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated border border-border-subtle text-secondary transition-all duration-200 group-hover:border-trust/40 group-hover:text-trust group-data-[state=open]:rotate-45 group-data-[state=open]:bg-trust/10 group-data-[state=open]:text-trust">
                    <Plus className="h-4 w-4" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm leading-relaxed text-secondary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-5 pb-5 pt-1 border-t border-border-subtle/50">
                  {faq.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
