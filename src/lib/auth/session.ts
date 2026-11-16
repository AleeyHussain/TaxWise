import { ADMIN_COOKIE_NAME, ADMIN_SESSION_DURATION_SEC } from "./constants";

const DEFAULT_DEV_SECRET = "taxwise-dev-secret-at-least-32-bytes-long-change-in-prod";

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_DEV_SECRET;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(username: string): Promise<string> {
  const expiresAt = Date.now() + ADMIN_SESSION_DURATION_SEC * 1000;
  const payload = `${username}:${expiresAt}`;
  const key = await getCryptoKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signatureHex = bufferToHex(signatureBuffer);
  return `${payload}.${signatureHex}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<{ username: string } | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signatureHex] = parts;
  const [username, expiresAtStr] = payload.split(":");
  if (!username || !expiresAtStr) return null;

  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return null;
  }

  const key = await getCryptoKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBytes = new Uint8Array(
    signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    enc.encode(payload),
  );

  if (!isValid) return null;
  return { username };
}

export { ADMIN_COOKIE_NAME, ADMIN_SESSION_DURATION_SEC };
