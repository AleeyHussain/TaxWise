import { NextResponse } from "next/server";
import { assistantRequestSchema } from "@/lib/validation/schemas";
import { orchestrateAssistant } from "@/features/assistant/orchestrator";
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants";
import {
  readJsonBodyWithLimit,
  validateRequestSecurity,
} from "@/lib/security/guards";

const RATE_CONFIG = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
};

export async function POST(request: Request) {
  const securityError = validateRequestSecurity(request, RATE_CONFIG, "assistant");
  if (securityError) return securityError;

  const { data: rawBody, errorResponse } = await readJsonBodyWithLimit(request);
  if (errorResponse) return errorResponse;

  const parsed = assistantRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => ({
      field: i.path.join(".") || "question",
      message: i.message,
    }));
    return NextResponse.json({ errors, error: errors[0]?.message }, { status: 400 });
  }

  try {
    const response = await orchestrateAssistant(parsed.data.question);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Assistant orchestration error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
