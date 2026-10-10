import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "../../../../lib/admin/rateLimit";
import {
  isAdminConfigured, isAllowedEmail, verifyPin, verifyTotp, rememberValidFor,
  createSessionToken, createRememberToken,
  SESSION_COOKIE, REMEMBER_COOKIE, baseCookieOptions, sessionCookieMaxAge, rememberCookieMaxAge,
} from "../../../../lib/admin/auth";

export const dynamic = "force-dynamic";

type Body = { email: string; pin: string; token?: string; remember?: boolean };

function parseBody(raw: unknown): Body | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) return null;
  if (typeof b.pin !== "string" || b.pin.length < 3 || b.pin.length > 32) return null;
  if (b.token !== undefined && typeof b.token !== "string") return null;
  if (b.remember !== undefined && typeof b.remember !== "boolean") return null;
  return { email: b.email, pin: b.pin, token: b.token as string | undefined, remember: b.remember as boolean | undefined };
}

export async function POST(req: NextRequest) {
  // Throttle brute-force attempts (in-memory, per instance).
  if (!rateLimit(`login:${clientIp(req)}`, { windowMs: 15 * 60_000, max: 10 })) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = parseBody(await req.json().catch(() => null));
  if (!body) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  // Generic failure for email + PIN so we don't reveal which one was wrong.
  if (!isAllowedEmail(email) || !verifyPin(body.pin)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const remembered = rememberValidFor(req.cookies.get(REMEMBER_COOKIE)?.value, email);

  // Second factor required unless this device is remembered.
  if (!remembered) {
    if (!body.token) {
      return NextResponse.json({ twofaRequired: true });
    }
    if (!verifyTotp(body.token)) {
      return NextResponse.json({ error: "invalid_2fa", twofaRequired: true }, { status: 401 });
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    ...baseCookieOptions(),
    maxAge: sessionCookieMaxAge,
  });

  // "Remember this device for 30 days": signed httpOnly token, only after a
  // successful TOTP verification.
  if (!remembered && body.remember) {
    res.cookies.set(REMEMBER_COOKIE, createRememberToken(email), {
      ...baseCookieOptions(),
      maxAge: rememberCookieMaxAge,
    });
  }

  return res;
}
