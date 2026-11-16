import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
