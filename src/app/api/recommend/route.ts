import { NextResponse } from "next/server";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import { validateAnswers } from "@/features/recommend/validation";
import { recommend } from "@/features/recommend/engine";
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants";
import {
  readJsonBodyWithLimit,
  validateRequestSecurity,
} from "@/lib/security/guards";
import type { QuestionnaireAnswers } from "@/types";

const RATE_CONFIG = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
};

export async function POST(request: Request) {
  const securityError = validateRequestSecurity(request, RATE_CONFIG, "recommend");
  if (securityError) return securityError;

  const { data: rawBody, errorResponse } = await readJsonBodyWithLimit(request);
  if (errorResponse) return errorResponse;

  const parsed = questionnaireAnswersSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const answers: QuestionnaireAnswers = parsed.data;
    const errors = validateAnswers(answers);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json({ result: recommend(answers) });
  } catch (error) {
    console.error("Recommend route error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
