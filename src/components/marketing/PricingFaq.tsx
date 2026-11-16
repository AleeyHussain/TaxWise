"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

const PRICING_FAQS = [
  {
    q: "Do I need to pay upfront?",
    a: "No upfront fees. You can freely explore recommendations, ask the assistant questions, and review plan feature comparisons before deciding to purchase or file.",
  },
  {
    q: "What's the refund policy?",
    a: "If your tax situation changes before you submit your return or if a higher tier doesn't support an unexpected schedule, we offer a 100% money-back satisfaction guarantee within 30 days.",
  },
  {
    q: "Can I switch plans mid-year?",
    a: "Yes. You can upgrade seamlessly at any time without re-entering previously imported tax slips or data. You only pay the prorated difference between the tiers.",
  },
];

export default function PricingFaq() {
  return (
    <section className="container-px pb-16 pt-6">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-xl font-bold text-primary sm:text-2xl text-center">
          Pricing & Billing Questions
        </h3>
        <p className="mt-2 text-sm text-center text-secondary">
          Transparent pricing with zero hidden add-ons or surprise checkout fees.
        </p>

        <Accordion.Root
          type="single"
          collapsible
          className="mt-8 divide-y divide-subtle border-y border-subtle"
        >
          {PRICING_FAQS.map((faq, idx) => (
            <Accordion.Item key={faq.q} value={`pricing-${idx}`} className="py-2">
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left font-semibold text-primary transition-colors hover:text-trust focus-visible:outline-none min-h-[44px]">
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <Plus className="h-4 w-4 shrink-0 text-secondary transition-transform duration-200 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden transition-[height] duration-200 ease-out data-[state=open]:h-[var(--radix-accordion-content-height)] data-[state=closed]:h-0">
                <p className="pb-4 pt-1 text-sm text-secondary leading-relaxed">
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
