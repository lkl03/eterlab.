import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail, SESSION_COOKIE } from "../../../../lib/admin/auth";
import { loadFinance } from "../../../../lib/admin/finance";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!getSessionEmail(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get("fresh") === "1";
  // Each source reports its own status, so this route always answers 200.
  return NextResponse.json(await loadFinance(force), { headers: { "Cache-Control": "no-store" } });
}
