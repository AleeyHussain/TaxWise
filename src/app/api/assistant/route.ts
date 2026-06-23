import { NextResponse } from "next/server";
import { screenUnsafe, simulatedAnswer } from "@/lib/assistant";
import { askGroq } from "@/lib/groq";

// POST /api/assistant
// Body: { question: string }. Tries the live Groq model first and falls back
// to the built-in simulated assistant if no key is set or the call fails.
export async function POST(request: Request) {
  let body: { question?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  // Unsafe questions get the safe response no matter which backend is active.
  const unsafe = screenUnsafe(question);
  if (unsafe) {
    return NextResponse.json({ response: unsafe });
  }

  if (process.env.GROQ_API_KEY) {
    try {
      const response = await askGroq(question);
      return NextResponse.json({ response });
    } catch (error) {
      // Log for the server operator, then fall back so the user still gets help.
      console.error("Groq call failed, using simulated assistant:", error);
    }
  }

  return NextResponse.json({ response: simulatedAnswer(question) });
}
