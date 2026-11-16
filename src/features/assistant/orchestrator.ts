import type { AssistantResponse } from "@/types";
import { askGroq } from "./groq-client";
import { screenUnsafe } from "./safety";
import { simulatedAnswer } from "./simulated";

export async function orchestrateAssistant(question: string): Promise<AssistantResponse> {
  const trimmed = question.trim();

  // Unsafe questions get the safe response no matter which backend is active.
  const unsafe = screenUnsafe(trimmed);
  if (unsafe) {
    return unsafe;
  }

  if (process.env.GROQ_API_KEY) {
    try {
      return await askGroq(trimmed);
    } catch (error) {
      // Log for the server operator, then fall back so the user still gets help.
      console.error("Groq call failed, using simulated assistant:", error);
    }
  }

  return simulatedAnswer(trimmed);
}
