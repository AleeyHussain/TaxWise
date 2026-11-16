import { NextResponse } from "next/server";
import { questionnaireAnswersSchema } from "@/lib/validation/schemas";
import { validateAnswers } from "@/features/recommend/validation";
import { recommend } from "@/features/recommend/engine";
import type { QuestionnaireAnswers } from "@/types";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "body", message: "Request body must be valid JSON." }] },
      { status: 400 },
    );
  }

  const parsed = questionnaireAnswersSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }

  const answers: QuestionnaireAnswers = parsed.data;
  const errors = validateAnswers(answers);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ result: recommend(answers) });
}
