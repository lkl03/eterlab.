/**
 * Admin panel auth — SERVER ONLY.
 *
 * Same scheme as the nodo admin: email allow-list + numeric PIN + TOTP
 * (Google Authenticator), with signed httpOnly session / remembered-device
 * cookies. Never import this from a client component.
 *
 * Nothing secret reaches the client: the API routes only return booleans
 * ("ok" / "twofaRequired") and set httpOnly cookies.
 *
 * Required env (see README → Admin):
 *   ADMIN_ALLOWED_EMAILS   comma-separated allow-list
 *   ADMIN_SESSION_SECRET   HMAC key for cookies + scrypt salt for the PIN
 *   ADMIN_PIN_HASH         scrypt(PIN, ADMIN_SESSION_SECRET) hex
 *   ADMIN_TOTP_SECRET      base32 TOTP shared secret
 */

import { createHmac, scryptSync, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "eterlab_admin_session";
export const REMEMBER_COOKIE = "eterlab_admin_2fa";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
const REMEMBER_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/* ── Config ──────────────────────────────────────────────────────────────── */
function allowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True only when every secret needed to actually log in is present. */
export function isAdminConfigured(): boolean {
  return (
    allowedEmails().length > 0 &&
    !!process.env.ADMIN_SESSION_SECRET &&
    !!process.env.ADMIN_PIN_HASH &&
    !!process.env.ADMIN_TOTP_SECRET
  );
}

export function isAllowedEmail(email: string): boolean {
  return allowedEmails().includes(email.trim().toLowerCase());
}

/* ── Constant-time comparisons ───────────────────────────────────────────── */
function safeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/* ── PIN ─────────────────────────────────────────────────────────────────── */
/** Verifies the PIN against ADMIN_PIN_HASH = scrypt(pin, ADMIN_SESSION_SECRET). */
export function verifyPin(pin: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const expected = process.env.ADMIN_PIN_HASH;
  if (!secret || !expected || !pin) return false;
  try {
    const got = scryptSync(pin, secret, 32).toString("hex");
    return safeEqualStr(got, expected);
  } catch {
    return false;
  }
}

/* ── TOTP (RFC 6238, SHA-1, 6 digits, 30s step) ──────────────────────────── */
function base32Decode(input: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.replace(/=+$/, "").toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    value = (value << 5) | alphabet.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 1_000_000).toString().padStart(6, "0");
}

/** Verifies a 6-digit TOTP token, allowing ±1 time step for clock drift. */
export function verifyTotp(token: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret || !token) return false;
  const clean = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return false;
  const key = base32Decode(secret);
  if (key.length === 0) return false;
  const step = Math.floor(Date.now() / 1000 / 30);
  for (let w = -1; w <= 1; w++) {
    if (safeEqualStr(hotp(key, step + w), clean)) return true;
  }
  return false;
}

/* ── Signed cookie tokens ────────────────────────────────────────────────── */
type TokenKind = "session" | "remember";
interface TokenPayload {
  email: string;
  kind: TokenKind;
  exp: number;
}

function sign(body: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function signToken(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function verifyToken(token: string | undefined): TokenPayload | null {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqualStr(sig, sign(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as TokenPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(email: string): string {
  return signToken({ email: email.toLowerCase(), kind: "session", exp: Date.now() + SESSION_TTL_MS });
}

export function createRememberToken(email: string): string {
  return signToken({ email: email.toLowerCase(), kind: "remember", exp: Date.now() + REMEMBER_TTL_MS });
}

/** Returns the admin email for a valid session token, or null. */
export function getSessionEmail(token: string | undefined): string | null {
  const p = verifyToken(token);
  if (!p || p.kind !== "session") return null;
  if (!isAllowedEmail(p.email)) return null;
  return p.email;
}

/** True if the remembered-device token is valid for this email (skips 2FA). */
export function rememberValidFor(token: string | undefined, email: string): boolean {
  const p = verifyToken(token);
  return !!p && p.kind === "remember" && p.email === email.toLowerCase() && isAllowedEmail(p.email);
}

/* ── Cookie options ──────────────────────────────────────────────────────── */
export const sessionCookieMaxAge = Math.floor(SESSION_TTL_MS / 1000);
export const rememberCookieMaxAge = Math.floor(REMEMBER_TTL_MS / 1000);

export function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}
