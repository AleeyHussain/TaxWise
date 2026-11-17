import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import PlanGrid from "@/components/marketing/PlanGrid";
import SectionDivider from "@/components/marketing/SectionDivider";

const Testimonials = dynamic(() => import("@/components/marketing/Testimonials"));
const HowItWorks = dynamic(() => import("@/components/marketing/HowItWorks"));
const PricingFaq = dynamic(() => import("@/components/marketing/PricingFaq"));
const FaqSection = dynamic(() => import("@/components/marketing/FaqSection"));
const FinalCta = dynamic(() => import("@/components/marketing/FinalCta"));

export const metadata: Metadata = {
  title: "TaxWise — The tax plan that actually fits your life",
  description:
    "Answer five questions. Get a plan matched to your income, deductions, and how much help you want — with the reasoning spelled out.",
};

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <SectionDivider />
      <PlanGrid />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <PricingFaq />
      <SectionDivider />
      <FaqSection />
      <SectionDivider />
      <FinalCta />
    </div>
  );
}
