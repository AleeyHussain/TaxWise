import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import PlanGrid from "@/components/marketing/PlanGrid";
import PricingFaq from "@/components/marketing/PricingFaq";
import Testimonials from "@/components/marketing/Testimonials";
import HowItWorks from "@/components/marketing/HowItWorks";
import FaqSection from "@/components/marketing/FaqSection";
import FinalCta from "@/components/marketing/FinalCta";
import SectionDivider from "@/components/marketing/SectionDivider";

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
