/**
 * Read-only Google Sheets access for the admin panel — SERVER ONLY.
 *
 * Authenticates as a Google service account (JWT bearer flow, signed with
 * node:crypto, no googleapis dependency) and reads the client checklist.
 * The sheet stays private: it only has to be shared with the service
 * account's email as Viewer.
 *
 * Env:
 *   GOOGLE_SERVICE_ACCOUNT_KEY   the service account JSON key (raw JSON or base64)
 *   CLIENTS_SHEET_ID             optional, defaults to the eterlab Client Checklist
 *   CLIENTS_SHEET_RANGE          optional, defaults to the first tab, A1:Z500
 */

import { createSign } from "crypto";

const DEFAULT_SHEET_ID = "1YFj2h48tuORHHm6ZEK4SMXdQb4AA4OPuVt5Zk0Z-ge8";
const DEFAULT_RANGE = "A1:Z500";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const CACHE_TTL_MS = 60_000;

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };

export class SheetsError extends Error {
  code: "not_configured" | "no_access" | "upstream";

  constructor(code: SheetsError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export function sheetId(): string {
  return process.env.CLIENTS_SHEET_ID || DEFAULT_SHEET_ID;
}

export function sheetUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId()}/edit`;
}

function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;
  try {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const sa = JSON.parse(json) as ServiceAccount;
    if (!sa.client_email || !sa.private_key) return null;
    return sa;
  } catch {
    return null;
  }
}

export function isSheetsConfigured(): boolean {
  return serviceAccount() !== null;
}

export function serviceAccountEmail(): string | null {
  return serviceAccount()?.client_email ?? null;
}

/* ── OAuth access token (cached until shortly before expiry) ─────────────── */
let tokenCache: { token: string; exp: number } | null = null;

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp - 60 > now) return tokenCache.token;

  const tokenUri = sa.token_uri || "https://oauth2.googleapis.com/token";
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: tokenUri, iat: now, exp: now + 3600 }),
  ).toString("base64url");
  const signature = createSign("RSA-SHA256").update(`${header}.${claims}`).sign(sa.private_key, "base64url");

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new SheetsError("upstream", `token exchange failed (${res.status})`);

  const data = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, exp: now + data.expires_in };
  return data.access_token;
}

/* ── Values ──────────────────────────────────────────────────────────────── */
let valuesCache: { rows: string[][]; fetchedAt: number } | null = null;

/** Returns the sheet's rows (header first) plus when they were fetched. */
export async function readSheetRows(force = false): Promise<{ rows: string[][]; fetchedAt: number }> {
  if (!force && valuesCache && Date.now() - valuesCache.fetchedAt < CACHE_TTL_MS) return valuesCache;

  const sa = serviceAccount();
  if (!sa) throw new SheetsError("not_configured", "GOOGLE_SERVICE_ACCOUNT_KEY is missing or invalid");

  const range = encodeURIComponent(process.env.CLIENTS_SHEET_RANGE || DEFAULT_RANGE);
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId()}/values/${range}`, {
    headers: { Authorization: `Bearer ${await accessToken(sa)}` },
    cache: "no-store",
  });

  if (res.status === 403 || res.status === 404) {
    throw new SheetsError("no_access", `the service account cannot read the sheet (${res.status})`);
  }
  if (!res.ok) throw new SheetsError("upstream", `sheets api error (${res.status})`);

  const data = (await res.json()) as { values?: string[][] };
  valuesCache = { rows: data.values ?? [], fetchedAt: Date.now() };
  return valuesCache;
}
