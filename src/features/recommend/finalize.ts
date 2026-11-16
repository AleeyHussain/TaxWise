import { requireProduct } from "@/features/products/catalogue";
import { DISCLAIMER } from "@/lib/constants";
import type {
  Confidence,
  OptionalUpgrade,
  QuestionnaireAnswers,
  RecommendationResult,
} from "@/types";
import { buildWarnings } from "./warnings";
import { expertAssistShadowUpgrade } from "./upgrades";

export function finalizeResult(
  productId: string,
  confidence: Confidence,
  reasons: string[],
  matchedInputs: string[],
  answers: QuestionnaireAnswers,
  defaultUpgrade?: OptionalUpgrade,
): RecommendationResult {
  const product = requireProduct(productId);
  const { warnings, unsupportedFeatures } = buildWarnings(answers, product);

  let upgrade = defaultUpgrade;
  if (
    unsupportedFeatures.length > 0 &&
    productId !== "expert-assist" &&
    productId !== "expert-full-service"
  ) {
    upgrade = expertAssistShadowUpgrade();
  }

  return {
    recommendedProductId: product.id,
    recommendedProductName: product.name,
    price: product.price,
    confidence,
    reasons,
    matchedInputs,
    optionalUpgrade: upgrade,
    warnings: warnings.length > 0 ? warnings : undefined,
    disclaimer: DISCLAIMER,
  };
}
