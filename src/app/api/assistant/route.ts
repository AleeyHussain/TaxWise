import { NextResponse } from "next/server";
import { assistantRequestSchema } from "@/lib/validation/schemas";
import { orchestrateAssistant } from "@/features/assistant/orchestrator";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid question format.";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  try {
    const response = await orchestrateAssistant(parsed.data.question);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Assistant orchestration error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
