import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail, SESSION_COOKIE } from "../../../../lib/admin/auth";
import { readSheetRows, sheetUrl, serviceAccountEmail, SheetsError } from "../../../../lib/admin/sheets";
import { parseClients } from "../../../../lib/admin/clients";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!getSessionEmail(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get("fresh") === "1";

  try {
    const { rows, fetchedAt } = await readSheetRows(force);
    return NextResponse.json(
      { clients: parseClients(rows), fetchedAt, sheetUrl: sheetUrl() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    if (err instanceof SheetsError) {
      const status = err.code === "upstream" ? 502 : 503;
      // The service account email is not secret and tells the admin who to share the sheet with.
      return NextResponse.json(
        { error: err.code, serviceAccount: serviceAccountEmail(), sheetUrl: sheetUrl() },
        { status },
      );
    }
    console.error("[admin/clients]", err);
    return NextResponse.json({ error: "upstream", sheetUrl: sheetUrl() }, { status: 502 });
  }
}
