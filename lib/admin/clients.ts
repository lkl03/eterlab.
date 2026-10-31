/**
 * Client checklist model — turns the raw Google Sheet rows into typed
 * clients. Pure (no I/O), so it runs on the server for the API route and its
 * types are shared with the dashboard.
 *
 * Columns are matched by header name, not position, so reordering or adding
 * columns in the sheet doesn't break the panel. Unknown named columns are
 * kept in `extra`; columns with an empty header (scratch notes) are ignored.
 */

export type PaymentKind = "free" | "one_time" | "trade" | "recurring" | "other";
export type StatusTone = "active" | "paused" | "pending" | "inactive" | "other";
export type ProjectKind = "vercel" | "github" | "other";

export type PaymentPart = {
  raw: string;
  kind: PaymentKind;
  label: string;
  amount: number | null;
  currency: string | null;
  detail: string | null;
};

export type Client = {
  number: string;
  name: string;
  url: string | null;
  href: string | null;
  project: { href: string; kind: ProjectKind } | null;
  start: { raw: string; iso: string | null };
  plan: string | null;
  payment: { raw: string; parts: PaymentPart[] };
  source: string | null;
  brand: string | null;
  status: { raw: string; tone: StatusTone; label: string };
  notes: string | null;
  domain: { registrar: string | null; renewsOn: string | null; managedBy: string | null };
  pending: string[];
  extra: Record<string, string>;
};

type Field =
  | "number" | "name" | "url" | "project" | "start" | "plan"
  | "payment" | "source" | "brand" | "status" | "notes";

// Checked in this order; each field claims the first header it matches.
const FIELD_PATTERNS: Array<[Field, RegExp]> = [
  ["number", /number|n[uú]mero|^#$|^n[°º]/i],
  ["project", /vercel|project|proyecto|repo/i],
  ["url", /url|sitio|web|dominio|domain/i],
  ["name", /name|nombre|cliente|client/i],
  ["start", /start|inicio|fecha|date/i],
  ["plan", /plan/i],
  ["payment", /payment|pago|precio|price/i],
  ["source", /knew|conoc|origen|source|canal/i],
  ["brand", /belongs|brand|marca/i],
  ["status", /status|estado/i],
  ["notes", /observ|notes?$|notas|comment/i],
];

function mapHeaders(header: string[]): { fields: Partial<Record<Field, number>>; extra: Array<[string, number]> } {
  const fields: Partial<Record<Field, number>> = {};
  const extra: Array<[string, number]> = [];

  header.forEach((rawName, i) => {
    const name = rawName.trim();
    if (!name) return;
    const hit = FIELD_PATTERNS.find(([f, re]) => fields[f] === undefined && re.test(name));
    if (hit) fields[hit[0]] = i;
    else extra.push([name, i]);
  });

  return { fields, extra };
}

const clean = (v: string | undefined) => (v ?? "").trim();
const orNull = (v: string) => (v && !/^(n\/?a|-|—)$/i.test(v) ? v : null);

/** "26/1/26", "02/03/2026" → "2026-01-26". Day-first, as written in Argentina. */
export function parseDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  let y = Number(m[3]);
  if (y < 100) y += 2000;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCMonth() !== mo - 1) return null;
  return date.toISOString().slice(0, 10);
}

function toHref(v: string): string | null {
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(v)) return `https://${v}`;
  return null;
}

// Symbol before or after the number; "30K" / "1.5M" shorthands allowed.
const AMOUNT_RE =
  /(U\$D|U\$S|USD|US\$|ARS|AR\$|\$)\s*(\d[\d.,]*)\s*([km])?(?![a-z])|(\d[\d.,]*)\s*([km])?\s*(U\$D|U\$S|USD|US\$|ARS|AR\$|\$)/i;

function parseAmount(raw: string): { amount: number; currency: string; rest: string } | null {
  const m = raw.match(AMOUNT_RE);
  if (!m) return null;
  const sym = (m[1] || m[6]).toUpperCase();
  const mult = { k: 1_000, m: 1_000_000 }[(m[3] || m[5] || "").toLowerCase()] ?? 1;
  const num = Number((m[2] || m[4]).replace(/\./g, "").replace(",", ".")) * mult;
  if (!Number.isFinite(num)) return null;
  const currency = /ARS|AR\$|^\$$/.test(sym) ? "ARS" : "USD";
  return { amount: num, currency, rest: raw.replace(m[0], "").trim() };
}

/**
 * A payment cell can hold several deals joined with "+", e.g.
 * "OTP 300 U$D + AR$30K monthly" → a one-time USD 300 and ARS 30.000 a month.
 */
export function parsePayment(raw: string): Client["payment"] {
  const v = raw.trim();
  const parts = v ? v.split(/\s*\+\s*/).filter(Boolean).map(parsePaymentPart) : [parsePaymentPart("")];
  return { raw: v, parts };
}

function parsePaymentPart(raw: string): PaymentPart {
  const v = raw.trim();
  if (!v || /^(free|gratis|sin cargo|bonificado)$/i.test(v)) {
    return { raw: v, kind: "free", label: "Sin cargo", amount: null, currency: null, detail: null };
  }

  const money = parseAmount(v);
  const isOneTime = /\bOTP\b|one[\s-]?time|[uú]nico/i.test(v);
  const isRecurring = /mensual|monthly|\/\s*mes|\bMRR\b|abono|suscrip|subscription|fee/i.test(v);
  const detail = (money ? money.rest : v).replace(/\bOTP\b/i, "").replace(/\s+/g, " ").trim() || null;

  if (isRecurring) {
    return { raw: v, kind: "recurring", label: "Mensual", amount: money?.amount ?? null, currency: money?.currency ?? null, detail };
  }
  if (money) {
    return { raw: v, kind: isOneTime ? "one_time" : "other", label: isOneTime ? "Pago único" : "Pago", amount: money.amount, currency: money.currency, detail };
  }
  if (isOneTime) {
    // A one-time "payment" with no money in it is a trade (e.g. "OTP 1 MONTH GYM").
    return { raw: v, kind: "trade", label: "Canje", amount: null, currency: null, detail };
  }
  return { raw: v, kind: "other", label: v, amount: null, currency: null, detail: null };
}

export function parseStatus(raw: string): Client["status"] {
  const v = raw.trim();
  const tone: StatusTone =
    /^(active|activo|activa|live|online)$/i.test(v) ? "active"
    : /pause|pausad|hold/i.test(v) ? "paused"
    : /pend|onboard|wip|progress|desarrollo|propuesta/i.test(v) ? "pending"
    : /inactiv|churn|baja|cancel|ended|finaliz|closed|cerrad/i.test(v) ? "inactive"
    : "other";
  const label =
    tone === "active" ? "Activo"
    : tone === "paused" ? "Pausado"
    : tone === "pending" ? "En curso"
    : tone === "inactive" ? "Inactivo"
    : v || "Sin estado";
  return { raw: v, tone, label };
}

export function parseNotes(notes: string): Pick<Client, "domain" | "pending"> {
  const registrar = notes.match(/dominio\s+(?:en|con)\s+([\wÀ-ÿ.-]+)/i)?.[1] ?? null;
  const renewRaw = notes.match(/renueva(?:\s+el)?\s+(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})/i)?.[1];
  // "a cargo de Aaron" → "Aaron"; "a cargo del cliente" → "cliente".
  const managedBy =
    notes.match(/a\s+cargo\s+de\s+([A-ZÀ-Ý][\wÀ-ÿ]*)/)?.[1] ??
    (/a\s+cargo\s+del\s+cliente/i.test(notes) ? "cliente" : null);
  const pending = notes
    .split(/->|→|;|\n/)
    .map((s) => s.trim())
    .filter((s) => /pendiente|pending|falta|to\s?do/i.test(s))
    .map((s) => s.replace(/\s*pendiente\s*$/i, "").replace(/^\w/, (c) => c.toUpperCase()));

  return {
    domain: { registrar: registrar ? registrar.toLowerCase() : null, renewsOn: renewRaw ? parseDate(renewRaw) : null, managedBy },
    pending,
  };
}

function projectFrom(v: string): Client["project"] {
  const href = toHref(v);
  if (!href) return null;
  const kind: ProjectKind = /vercel\.com/i.test(href) ? "vercel" : /github\.com/i.test(href) ? "github" : "other";
  return { href, kind };
}

/** Parses the sheet rows (header first) into clients, skipping blank rows. */
export function parseClients(rows: string[][]): Client[] {
  if (rows.length < 2) return [];
  const { fields, extra } = mapHeaders(rows[0]);
  const get = (row: string[], f: Field) => (fields[f] === undefined ? "" : clean(row[fields[f]!]));

  return rows.slice(1).flatMap((row) => {
    const name = get(row, "name");
    const number = get(row, "number");
    if (!name && !number) return [];

    const url = get(row, "url");
    const startRaw = get(row, "start");
    const notes = get(row, "notes");
    const extraValues: Record<string, string> = {};
    for (const [label, i] of extra) {
      const v = clean(row[i]);
      if (v) extraValues[label] = v;
    }

    const client: Client = {
      number,
      name: name || number,
      url: orNull(url),
      href: toHref(url),
      project: projectFrom(get(row, "project")),
      start: { raw: startRaw, iso: parseDate(startRaw) },
      plan: orNull(get(row, "plan")),
      payment: parsePayment(get(row, "payment")),
      source: orNull(get(row, "source")),
      brand: orNull(get(row, "brand")),
      status: parseStatus(get(row, "status")),
      notes: orNull(notes),
      ...parseNotes(notes),
      extra: extraValues,
    };
    return [client];
  });
}
