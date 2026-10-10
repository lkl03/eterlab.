import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, REMEMBER_COOKIE, baseCookieOptions } from "../../../../lib/admin/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const forgetDevice = body?.forgetDevice === true;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...baseCookieOptions(), maxAge: 0 });
  // Optionally also drop the 30-day remembered-device token.
  if (forgetDevice) {
    res.cookies.set(REMEMBER_COOKIE, "", { ...baseCookieOptions(), maxAge: 0 });
  }
  return res;
}
