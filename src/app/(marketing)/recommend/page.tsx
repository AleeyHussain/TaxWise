import type { Metadata } from "next";
import { Wizard } from "./_components/Wizard";

export const metadata: Metadata = {
  title: "Find My Plan — TaxWise",
  description: "Answer five questions to get a personalized tax plan recommendation.",
};

export default function RecommendPage() {
  return (
    <div className="container-px py-12">
      <Wizard />
    </div>
  );
}
