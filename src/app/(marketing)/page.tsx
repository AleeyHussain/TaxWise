import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import CampaignManifesto from "@/components/marketing/CampaignManifesto";
import FilingShowcaseStrip from "@/components/marketing/FilingShowcaseStrip";
import EngineStorytelling from "@/components/marketing/EngineStorytelling";
import PlanGrid from "@/components/marketing/PlanGrid";
import Testimonials from "@/components/marketing/Testimonials";
import UnifiedFaq from "@/components/marketing/UnifiedFaq";
import FinalCta from "@/components/marketing/FinalCta";
import SectionDivider from "@/components/marketing/SectionDivider";

export const metadata: Metadata = {
  title: "TaxWise — The tax plan that actually fits your life",
  description:
    "Answer five questions. Get a plan matched to your income, deductions, and how much help you want — with statutory reasoning spelled out.",
};

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <SectionDivider />
      <CampaignManifesto />
      <SectionDivider />
      <FilingShowcaseStrip />
      <SectionDivider />
      <EngineStorytelling />
      <SectionDivider />
      <PlanGrid />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <UnifiedFaq />
      <SectionDivider />
      <FinalCta />
    </main>
  );
}
