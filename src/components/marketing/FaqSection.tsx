"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

const FAQ = [
  {
    q: "How does the recommendation work?",
    a: "Your answers run through a deterministic rules engine. Corporate filings come first, then expert-help options, then self-employment, investments, common deductions, and finally a simple free return. The highest-priority rule that matches wins.",
  },
  {
    q: "Is this real tax advice?",
    a: "No. TaxWise only points you to a software plan based on the product rules. It is not tax, legal or financial advice. For your specific situation, talk to a qualified tax professional.",
  },
  {
    q: "Do I need an account to try it?",
    a: "No account needed. You can run the questionnaire, compare plans and ask the assistant without signing up.",
  },
  {
    q: "What can the assistant help with?",
    a: "Ask it product questions in plain language, like which plan fits salary and donations, or the difference between two plans. It answers from the same product data the rest of the site uses.",
  },
];

export default function FaqSection() {
  return (
    <section className="container-px py-16 md:py-24 border-t border-subtle">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl text-center">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-center text-secondary">
          Common questions about the rules engine and recommendation criteria.
        </p>

        <Accordion.Root
          type="single"
          collapsible
          className="mt-8 space-y-3"
        >
          {FAQ.map((item, idx) => (
            <Accordion.Item
              key={item.q}
              value={`item-${idx}`}
              className="group rounded-2xl border border-subtle bg-surface/60 backdrop-blur-sm transition-all duration-200 hover:border-trust/40 hover:shadow-md data-[state=open]:border-trust/60 data-[state=open]:bg-surface"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold text-primary transition-colors hover:text-trust focus-visible:outline-none min-h-[52px]">
                  <span className="text-base sm:text-lg font-bold text-primary group-hover:text-trust transition-colors">
                    {item.q}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated border border-subtle text-secondary transition-all duration-200 group-hover:border-trust/40 group-hover:text-trust group-data-[state=open]:rotate-45 group-data-[state=open]:bg-trust/10 group-data-[state=open]:text-trust">
                    <Plus className="h-4 w-4" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden transition-[height] duration-200 ease-out data-[state=open]:h-[var(--radix-accordion-content-height)] data-[state=closed]:h-0">
                <p className="px-5 pb-5 pt-1 text-sm sm:text-base text-secondary leading-relaxed border-t border-subtle/50">
                  {item.a}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
