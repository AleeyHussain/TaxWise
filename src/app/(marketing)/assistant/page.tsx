import type { Metadata } from "next";
import AssistantClientView from "./_components/AssistantClientView";

export const metadata: Metadata = {
  title: "Tax Assistant — TaxWise",
  description:
    "Ask questions about your tax situation in plain language and get matched to the right software plan with full safety grounding.",
};

export default function AssistantPage() {
  return <AssistantClientView />;
}
