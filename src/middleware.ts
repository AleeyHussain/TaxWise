import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin route protection
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/admin/login")
  ) {
    const isAuthed = await isAuthenticatedAdmin(request);
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // 2. Security Headers (Phase 2.4)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  // Content-Security-Policy
  // default-src: only allow same origin by default
  // script-src: allow same origin, plus unsafe-inline for anti-flash theme script
  // style-src: allow same origin, plus unsafe-inline for Tailwind/CSS variables
  // img-src: allow same origin, data URLs, and https
  // connect-src: only allow same origin
  // frame-ancestors: deny embedding anywhere
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
