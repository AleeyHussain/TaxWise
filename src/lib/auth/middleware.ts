import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "./constants";
import { verifySessionToken } from "./session";

export async function isAuthenticatedAdmin(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookie) return false;
  const session = await verifySessionToken(cookie);
  return session !== null;
}
