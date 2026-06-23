import { NextResponse } from "next/server";
import { recommend, validateAnswers } from "@/lib/recommend";
import type { QuestionnaireAnswers } from "@/lib/types";

// POST /api/recommend
// Body: QuestionnaireAnswers. Returns the recommendation or a 400 with the
// list of validation problems.
export async function POST(request: Request) {
  let body: Partial<QuestionnaireAnswers>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "body", message: "Request body must be valid JSON." }] },
      { status: 400 },
    );
  }

  const answers: QuestionnaireAnswers = {
    filingType: body.filingType ?? null,
    incomeSources: Array.isArray(body.incomeSources) ? body.incomeSources : [],
    deductions: Array.isArray(body.deductions) ? body.deductions : [],
    helpPreference: body.helpPreference ?? null,
    companyHadRevenue:
      typeof body.companyHadRevenue === "boolean" ? body.companyHadRevenue : null,
  };

  const errors = validateAnswers(answers);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  return NextResponse.json({ result: recommend(answers) });
}
