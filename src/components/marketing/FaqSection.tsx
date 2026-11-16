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
          className="mt-8 divide-y divide-subtle border-y border-subtle"
        >
          {FAQ.map((item, idx) => (
            <Accordion.Item key={item.q} value={`item-${idx}`} className="py-2">
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left font-semibold text-primary transition-colors hover:text-trust focus-visible:outline-none min-h-[44px]">
                  <span className="text-sm sm:text-base">{item.q}</span>
                  <Plus className="h-4 w-4 shrink-0 text-secondary transition-transform duration-200 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden transition-[height] duration-200 ease-out data-[state=open]:h-[var(--radix-accordion-content-height)] data-[state=closed]:h-0">
                <p className="pb-4 pt-1 text-sm text-secondary leading-relaxed">
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
