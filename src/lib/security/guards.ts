import { NextResponse } from "next/server";
import { checkRateLimit, type RateLimitConfig } from "./rate-limit";
import { isValidOrigin } from "./csrf";

export const MAX_BODY_SIZE_BYTES = 8 * 1024; // 8 KB

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export function validateRequestSecurity(
  request: Request,
  rateLimitConfig: RateLimitConfig,
  keyPrefix = "general",
): NextResponse | null {
  // 1. Origin check
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  // 2. Content-Type check
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  // 3. Body size limit
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Payload exceeds 8 KB limit." },
      { status: 413 },
    );
  }

  // 4. Rate limit check
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = checkRateLimit(`${keyPrefix}:${ip}`, rateLimitConfig);
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetAt.toString(),
        },
      },
    );
  }

  return null;
}

export async function readJsonBodyWithLimit<T = unknown>(
  request: Request,
): Promise<{ data?: T; errorResponse?: NextResponse }> {
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_SIZE_BYTES) {
      return {
        errorResponse: NextResponse.json(
          { error: "Payload exceeds 8 KB limit." },
          { status: 413 },
        ),
      };
    }
    const data = JSON.parse(text) as T;
    return { data };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { errors: [{ field: "body", message: "Request body must be valid JSON." }] },
        { status: 400 },
      ),
    };
  }
}
