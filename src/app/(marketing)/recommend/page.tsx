import type { Metadata } from "next";
import { Wizard } from "./_components/Wizard";
import { recommend } from "@/features/recommend/engine";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { data?: string };
}): Promise<Metadata> {
  if (searchParams?.data) {
    try {
      const decoded = Buffer.from(searchParams.data, "base64").toString("utf-8");
      const parsed = JSON.parse(decoded);
      const validated = questionnaireAnswersSchema.safeParse(parsed);
      if (validated.success) {
        const result = recommend(validated.data);
        const priceLabel = result.price === 0 ? "Free ($0)" : `$${result.price}`;
        const desc = `TaxWise personalized recommendation: ${result.recommendedProductName} (${priceLabel}). ${result.reasons[0] ?? ""}`;
        return {
          title: `${result.recommendedProductName} Recommendation — TaxWise`,
          description: desc,
          openGraph: {
            title: `${result.recommendedProductName} Recommendation — TaxWise`,
            description: desc,
          },
        };
      }
    } catch {}
  }

  return {
    title: "Find My Plan — TaxWise",
    description: "Answer five questions to get a personalized tax plan recommendation.",
    openGraph: {
      title: "Find My Plan — TaxWise",
      description: "Answer five questions to get a personalized tax plan recommendation.",
    },
  };
}

export default function RecommendPage() {
  return (
    <div className="container-px py-12 md:py-16">
      <Wizard />
    </div>
  );
}
