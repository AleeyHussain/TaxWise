import { requireProduct } from "@/features/products/catalogue";
import type { OptionalUpgrade } from "@/types";

export function expertReviewUpgrade(): OptionalUpgrade {
  const expert = requireProduct("expert-assist");
  return {
    productId: expert.id,
    productName: expert.name,
    reason:
      "If you would like a tax expert to look over your return before you file, Expert Assist adds expert chat and a review.",
  };
}

export function expertAssistShadowUpgrade(): OptionalUpgrade {
  const expert = requireProduct("expert-assist");
  return {
    productId: expert.id,
    productName: expert.name,
    reason:
      "Expert Assist supports everything you selected and may be a better fit if you want one plan for all of it.",
  };
}
