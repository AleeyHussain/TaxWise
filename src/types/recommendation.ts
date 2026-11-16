export type Confidence = "low" | "medium" | "high";

export interface OptionalUpgrade {
  productId: string;
  productName: string;
  reason: string;
}

export interface RecommendationResult {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: Confidence;
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: OptionalUpgrade;
  warnings?: string[];
  disclaimer: string;
}
