import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken } from "@/lib/auth/session";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_DURATION_SEC,
} from "@/lib/auth/constants";
import {
  ADMIN_LOGIN_MAX_ATTEMPTS,
  ADMIN_LOGIN_WINDOW_MS,
} from "@/lib/constants";
import {
  readJsonBodyWithLimit,
  validateRequestSecurity,
} from "@/lib/security/guards";

const RATE_CONFIG = {
  windowMs: ADMIN_LOGIN_WINDOW_MS,
  maxRequests: ADMIN_LOGIN_MAX_ATTEMPTS,
};

export async function POST(request: Request) {
  const securityError = validateRequestSecurity(request, RATE_CONFIG, "admin-login");
  if (securityError) return securityError;

  const { data: rawBody, errorResponse } = await readJsonBodyWithLimit(request);
  if (errorResponse) return errorResponse;

  const parsed = adminLoginSchema.safeParse(rawBody);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => ({
      field: i.path.join(".") || "form",
      message: i.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { username, password } = parsed.data;

  try {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!expectedUsername || !expectedHash) {
      console.warn("ADMIN_USERNAME or ADMIN_PASSWORD_HASH not configured");
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (username !== expectedUsername) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const passwordMatch = await verifyPassword(password, expectedHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createSessionToken(username);

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ADMIN_SESSION_DURATION_SEC,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
