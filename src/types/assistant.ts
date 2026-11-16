import type { Confidence } from "./recommendation";

export interface AssistantResponse {
  answer: string;
  recommendedProduct: string | null;
  confidence: Confidence;
  reasons: string[];
  disclaimer: string;
  source: "ai" | "simulated";
}
