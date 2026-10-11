/**
 * Finance data for the admin panel — SERVER ONLY.
 *
 * Recurring revenue comes from MercadoPago subscriptions (preapprovals) and
 * ad spend from the Meta Marketing API. Both are read-only, cached for a few
 * minutes, and each source fails on its own: a missing Meta token never hides
 * the MRR.
 *
 * Env:
 *   MP_ACCESS_TOKEN       access token of the MercadoPago app used by the admin
 *   META_ADS_TOKEN        Meta system-user token with ads_read
 *   META_AD_ACCOUNT_IDS   optional, comma-separated ad account ids (defaults to nodo's two)
 *   META_GRAPH_VERSION    optional, defaults to v23.0
 */

export type Product = "nodo" | "eterlab" | "otro";

/** One real charge of a subscription, with what MercadoPago kept. */
export type Charge = {
  date: string | null;
  gross: number;
  fee: number | null;
  net: number | null;
  status: string;
  statusLabel: string;
};

export type Subscription = {
  id: string;
  product: Product;
  reason: string;
  status: string;
  statusLabel: string;
  active: boolean;
  amount: number | null;
  currency: string;
  frequencyLabel: string;
  /** Amount normalized to one month; null when the frequency is unknown. */
  monthly: number | null;
  since: string | null;
  nextPayment: string | null;
  chargedTotal: number | null;
  chargedCount: number | null;
  reference: string | null;
  /** Real charges, newest first; empty when MercadoPago didn't answer. */
  charges: Charge[];
  /** MercadoPago's cut on the latest charge that had one (0.043 = 4,3 %). */
  feeRate: number | null;
  /** Monthly amount after MercadoPago's cut, estimated with feeRate. */
  monthlyNet: number | null;
  /** Net actually credited by approved charges. */
  chargedNet: number | null;
  /** Charges that need a look (mediation, refund, chargeback). */
  issues: string[];
};

export type RevenueByCurrency = {
  currency: string;
  /** Gross: what the subscriptions charge, before MercadoPago's cut. */
  mrr: number;
  arr: number;
  /** After MercadoPago's cut; null when no charge has fee data yet. */
  mrrNet: number | null;
  arrNet: number | null;
  /** Weighted MercadoPago cut across active subscriptions. */
  feeRate: number | null;
  byProduct: Partial<Record<Product, number>>;
  activeCount: number;
};

export type Campaign = {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  currency: string;
  product: Product;
  status: string;
  statusLabel: string;
  active: boolean;
  objective: string | null;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  spendMonth: number;
  spendTotal: number;
  startTime: string | null;
  stopTime: string | null;
  href: string;
};

export type SpendByCurrency = {
  currency: string;
  month: number;
  total: number;
  byProduct: Partial<Record<Product, number>>;
  activeCount: number;
};

type SourceStatus = "ok" | "not_configured" | "auth_error" | "error";

export type FinancePayload = {
  fetchedAt: number;
  mp: { status: SourceStatus; subscriptions: Subscription[]; revenue: RevenueByCurrency[] };
  meta: {
    status: SourceStatus;
    campaigns: Campaign[];
    spend: SpendByCurrency[];
    accounts: Array<{ id: string; name: string; currency: string; error?: string }>;
  };
};

const CACHE_TTL_MS = 5 * 60_000;
const DEFAULT_AD_ACCOUNTS = ["287949821825872", "2517150942110792"];
// Labels for accounts whose Meta name is empty or just the id.
const ACCOUNT_LABELS: Record<string, string> = {
  "287949821825872": "nodo (ARS)",
  "2517150942110792": "nodo (USD)",
};

/* ── Shared ──────────────────────────────────────────────────────────────── */
export function productFrom(...texts: Array<string | null | undefined>): Product {
  const t = texts.filter(Boolean).join(" ");
  if (/\bnodo\b/i.test(t)) return "nodo";
  if (/eterlab/i.test(t)) return "eterlab";
  return "otro";
}

const isoDate = (v: string | null | undefined) => (v ? v.slice(0, 10) : null);

/* ── MercadoPago ─────────────────────────────────────────────────────────── */
type MpPreapproval = {
  id: string;
  status: string;
  reason?: string | null;
  external_reference?: string | null;
  date_created?: string | null;
  next_payment_date?: string | null;
  auto_recurring?: {
    frequency?: number | null;
    frequency_type?: string | null;
    transaction_amount?: number | null;
    currency_id?: string | null;
  } | null;
  summarized?: { charged_amount?: number | null; charged_quantity?: number | null } | null;
};

const MP_STATUS: Record<string, string> = {
  authorized: "Activa",
  paused: "Pausada",
  pending: "Pendiente",
  cancelled: "Cancelada",
};

function monthlyAmount(amount: number | null, frequency?: number | null, type?: string | null): number | null {
  if (amount === null || !frequency || frequency <= 0) return null;
  if (type === "months") return amount / frequency;
  if (type === "days") return (amount * 30) / frequency;
  return null;
}

function frequencyLabel(frequency?: number | null, type?: string | null): string {
  if (!frequency || !type) return "—";
  if (type === "months") return frequency === 1 ? "Mensual" : frequency === 12 ? "Anual" : `Cada ${frequency} meses`;
  if (type === "days") return frequency === 7 ? "Semanal" : `Cada ${frequency} días`;
  return `${frequency} ${type}`;
}

type MpAuthorizedPayment = {
  status?: string;
  transaction_amount?: number | null;
  date_created?: string | null;
  payment?: { id?: number | string | null; status?: string | null } | null;
};

type MpPayment = {
  status?: string;
  transaction_amount?: number | null;
  date_approved?: string | null;
  date_created?: string | null;
  transaction_details?: { net_received_amount?: number | null } | null;
  fee_details?: Array<{ amount?: number | null; fee_payer?: string | null }> | null;
};

const PAYMENT_STATUS: Record<string, string> = {
  approved: "Acreditado",
  in_mediation: "En mediación",
  pending: "Pendiente",
  in_process: "En proceso",
  authorized: "Autorizado",
  refunded: "Devuelto",
  charged_back: "Contracargo",
  rejected: "Rechazado",
  cancelled: "Cancelado",
};

const ISSUE_STATUSES = new Set(["in_mediation", "refunded", "charged_back"]);

export function toCharge(a: MpAuthorizedPayment, pay: MpPayment | null): Charge {
  const gross = pay?.transaction_amount ?? a.transaction_amount ?? 0;
  // Only the fees the seller pays come out of what we receive.
  const fee = pay?.fee_details
    ? pay.fee_details.filter((f) => f.fee_payer !== "payer").reduce((acc, f) => acc + (f.amount ?? 0), 0)
    : null;
  const net = pay?.transaction_details?.net_received_amount ?? (fee !== null ? gross - fee : null);
  const status = pay?.status ?? a.payment?.status ?? a.status ?? "unknown";
  return {
    date: isoDate(pay?.date_approved ?? pay?.date_created ?? a.date_created),
    gross,
    fee,
    net,
    status,
    statusLabel: PAYMENT_STATUS[status] ?? status,
  };
}

/** Adds the real charges (and what MercadoPago kept) to a subscription. */
export function withCharges(sub: Subscription, charges: Charge[]): Subscription {
  const withFee = charges.find((c) => c.fee !== null && c.gross > 0);
  const feeRate = withFee ? withFee.fee! / withFee.gross : null;
  const approved = charges.filter((c) => c.status === "approved" && c.net !== null);
  const issues = charges
    .filter((c) => ISSUE_STATUSES.has(c.status))
    .map((c) => `Cobro${c.date ? ` del ${c.date.split("-").reverse().join("/")}` : ""}: ${c.statusLabel.toLowerCase()}`);
  return {
    ...sub,
    charges,
    feeRate,
    monthlyNet: sub.monthly !== null && feeRate !== null ? sub.monthly * (1 - feeRate) : null,
    chargedNet: approved.length ? approved.reduce((acc, c) => acc + c.net!, 0) : null,
    issues,
  };
}

export function toSubscription(p: MpPreapproval): Subscription {
  const ar = p.auto_recurring ?? {};
  const amount = ar.transaction_amount ?? null;
  return {
    id: p.id,
    product: productFrom(p.reason, p.external_reference),
    reason: p.reason?.trim() || "Suscripción",
    status: p.status,
    statusLabel: MP_STATUS[p.status] ?? p.status,
    active: p.status === "authorized",
    amount,
    currency: ar.currency_id ?? "ARS",
    frequencyLabel: frequencyLabel(ar.frequency, ar.frequency_type),
    monthly: monthlyAmount(amount, ar.frequency, ar.frequency_type),
    since: isoDate(p.date_created),
    nextPayment: p.status === "authorized" ? isoDate(p.next_payment_date) : null,
    chargedTotal: p.summarized?.charged_amount ?? null,
    chargedCount: p.summarized?.charged_quantity ?? null,
    reference: p.external_reference?.trim() || null,
    charges: [],
    feeRate: null,
    monthlyNet: null,
    chargedNet: null,
    issues: [],
  };
}

export function summarizeRevenue(subs: Subscription[]): RevenueByCurrency[] {
  const map = new Map<string, RevenueByCurrency & { feeBase: number; feeAmount: number }>();
  for (const s of subs) {
    if (!s.active || s.monthly === null) continue;
    const r = map.get(s.currency) ?? {
      currency: s.currency,
      mrr: 0,
      arr: 0,
      mrrNet: null,
      arrNet: null,
      feeRate: null,
      byProduct: {},
      activeCount: 0,
      feeBase: 0,
      feeAmount: 0,
    };
    r.mrr += s.monthly;
    r.byProduct[s.product] = (r.byProduct[s.product] ?? 0) + s.monthly;
    r.activeCount += 1;
    if (s.feeRate !== null) {
      r.feeBase += s.monthly;
      r.feeAmount += s.monthly * s.feeRate;
    }
    map.set(s.currency, r);
  }
  return [...map.values()]
    .map(({ feeBase, feeAmount, ...r }) => {
      // Subscriptions without a charge yet borrow the rate seen on the others.
      const feeRate = feeBase > 0 ? feeAmount / feeBase : null;
      const mrrNet = feeRate !== null ? r.mrr * (1 - feeRate) : null;
      return { ...r, arr: r.mrr * 12, feeRate, mrrNet, arrNet: mrrNet !== null ? mrrNet * 12 : null };
    })
    .sort((a, b) => b.mrr - a.mrr);
}

/** Charges of one subscription. Best effort: on any error it returns none. */
async function loadCharges(preapprovalId: string, token: string): Promise<Charge[]> {
  async function get<T>(path: string): Promise<T | null> {
    const res = await fetch(`https://api.mercadopago.com${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? ((await res.json()) as T) : null;
  }
  try {
    const list = await get<{ results?: MpAuthorizedPayment[] }>(
      `/authorized_payments/search?preapproval_id=${encodeURIComponent(preapprovalId)}`,
    );
    const charges: Charge[] = [];
    // Sequential on purpose: MercadoPago rate-limits bursts (429).
    for (const a of list?.results ?? []) {
      if (!a.payment?.id) continue;
      const pay = await get<MpPayment>(`/v1/payments/${encodeURIComponent(String(a.payment.id))}`);
      charges.push(toCharge(a, pay));
    }
    return charges.sort((x, y) => (y.date ?? "").localeCompare(x.date ?? ""));
  } catch (err) {
    console.error("[admin/finance] mercadopago charges", preapprovalId, err);
    return [];
  }
}

async function loadMercadoPago(): Promise<FinancePayload["mp"]> {
  const token = process.env.MP_ACCESS_TOKEN?.trim();
  if (!token) return { status: "not_configured", subscriptions: [], revenue: [] };

  try {
    const all: MpPreapproval[] = [];
    for (let offset = 0; offset < 1000; offset += 100) {
      const res = await fetch(
        `https://api.mercadopago.com/preapproval/search?limit=100&offset=${offset}&sort=date_created:desc`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (res.status === 401 || res.status === 403) return { status: "auth_error", subscriptions: [], revenue: [] };
      if (!res.ok) throw new Error(`mercadopago ${res.status}`);
      const page = (await res.json()) as { results?: MpPreapproval[] };
      all.push(...(page.results ?? []));
      if (!page.results || page.results.length < 100) break;
    }

    const subscriptions: Subscription[] = [];
    for (const p of all) {
      const sub = toSubscription(p);
      // Only subscriptions that already charged have payments to read.
      subscriptions.push(sub.chargedCount ? withCharges(sub, await loadCharges(p.id, token)) : sub);
    }
    const order = (s: Subscription) => (s.active ? 0 : s.status === "paused" || s.status === "pending" ? 1 : 2);
    subscriptions.sort((a, b) => order(a) - order(b) || (b.monthly ?? 0) - (a.monthly ?? 0));
    return { status: "ok", subscriptions, revenue: summarizeRevenue(subscriptions) };
  } catch (err) {
    console.error("[admin/finance] mercadopago", err);
    return { status: "error", subscriptions: [], revenue: [] };
  }
}

/* ── Meta Ads ────────────────────────────────────────────────────────────── */
type GraphCampaign = {
  id: string;
  name: string;
  effective_status?: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
};

const META_STATUS: Record<string, string> = {
  ACTIVE: "Activa",
  PAUSED: "Pausada",
  CAMPAIGN_PAUSED: "Pausada",
  ADSET_PAUSED: "Pausada",
  ARCHIVED: "Archivada",
  DELETED: "Eliminada",
  IN_PROCESS: "En revisión",
  PENDING_REVIEW: "En revisión",
  WITH_ISSUES: "Con problemas",
  DISAPPROVED: "Rechazada",
  PENDING_BILLING_INFO: "Falta medio de pago",
};

const META_OBJECTIVE: Record<string, string> = {
  OUTCOME_LEADS: "Clientes potenciales",
  OUTCOME_TRAFFIC: "Tráfico",
  OUTCOME_AWARENESS: "Reconocimiento",
  OUTCOME_ENGAGEMENT: "Interacción",
  OUTCOME_SALES: "Ventas",
  OUTCOME_APP_PROMOTION: "Promoción de app",
  CONVERSIONS: "Conversiones",
  LINK_CLICKS: "Tráfico",
  MESSAGES: "Mensajes",
  LEAD_GENERATION: "Clientes potenciales",
};

// Meta returns budgets in the currency's minor unit; these have none.
const NO_MINOR_UNIT = new Set(["CLP", "COP", "CRC", "HUF", "ISK", "IDR", "JPY", "KRW", "PYG", "TWD", "VND"]);

class MetaError extends Error {
  auth: boolean;
  constructor(message: string, auth: boolean) {
    super(message);
    this.auth = auth;
  }
}

async function graph<T>(path: string, token: string): Promise<T> {
  const version = process.env.META_GRAPH_VERSION || "v23.0";
  const res = await fetch(`https://graph.facebook.com/${version}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as T & { error?: { code?: number; message?: string } };
  if (!res.ok || body.error) {
    const code = body.error?.code;
    throw new MetaError(body.error?.message ?? `graph ${res.status}`, code === 190 || code === 102 || res.status === 401);
  }
  return body;
}

async function campaignSpend(accountId: string, preset: "maximum" | "this_month", token: string) {
  const spend = new Map<string, number>();
  let path: string | null =
    `act_${accountId}/insights?level=campaign&fields=campaign_id,spend&date_preset=${preset}&limit=500`;
  while (path) {
    const page: { data?: Array<{ campaign_id: string; spend?: string }>; paging?: { next?: string } } = await graph(path, token);
    for (const row of page.data ?? []) spend.set(row.campaign_id, (spend.get(row.campaign_id) ?? 0) + Number(row.spend ?? 0));
    path = page.paging?.next ? page.paging.next.replace(/^https:\/\/graph\.facebook\.com\/v[\d.]+\//, "") : null;
  }
  return spend;
}

async function loadAccount(accountId: string, token: string) {
  // Only fields ads_read can see: business{name} needs business_management.
  const acct = await graph<{ name?: string; currency?: string }>(`act_${accountId}?fields=name,currency`, token);
  const currency = acct.currency ?? "USD";
  const minor = NO_MINOR_UNIT.has(currency) ? 1 : 100;
  const accountName = acct.name && acct.name !== accountId ? acct.name : (ACCOUNT_LABELS[accountId] ?? accountId);

  const [list, total, month] = await Promise.all([
    graph<{ data?: GraphCampaign[] }>(
      `act_${accountId}/campaigns?fields=id,name,effective_status,objective,daily_budget,lifetime_budget,start_time,stop_time&limit=200`,
      token,
    ),
    campaignSpend(accountId, "maximum", token),
    campaignSpend(accountId, "this_month", token),
  ]);

  // Paused campaigns started over a year ago with nothing spent this month are history, not "ads".
  const staleBefore = new Date(Date.now() - 365 * 86_400_000).toISOString().slice(0, 10);
  const relevant = (list.data ?? []).filter(
    (c) => c.effective_status === "ACTIVE" || (month.get(c.id) ?? 0) > 0 || (isoDate(c.start_time) ?? "9999") >= staleBefore,
  );

  const campaigns: Campaign[] = relevant.map((c) => {
    const status = c.effective_status ?? "UNKNOWN";
    const byName = productFrom(c.name);
    return {
      id: c.id,
      name: c.name,
      accountId,
      accountName,
      currency,
      // The campaign name decides; the account only breaks a tie (nodo's account
      // also holds unrelated 2022 Marketplace promos).
      product: byName !== "otro" ? byName : productFrom(accountName),
      status,
      statusLabel: META_STATUS[status] ?? status,
      active: status === "ACTIVE",
      objective: c.objective ? (META_OBJECTIVE[c.objective] ?? c.objective) : null,
      dailyBudget: c.daily_budget ? Number(c.daily_budget) / minor : null,
      lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) / minor : null,
      spendMonth: month.get(c.id) ?? 0,
      spendTotal: total.get(c.id) ?? 0,
      startTime: isoDate(c.start_time),
      stopTime: isoDate(c.stop_time),
      href: `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${accountId}&selected_campaign_ids=${c.id}`,
    };
  });

  return { account: { id: accountId, name: accountName, currency }, campaigns };
}

export function summarizeSpend(campaigns: Campaign[]): SpendByCurrency[] {
  const map = new Map<string, SpendByCurrency>();
  for (const c of campaigns) {
    const s = map.get(c.currency) ?? { currency: c.currency, month: 0, total: 0, byProduct: {}, activeCount: 0 };
    s.month += c.spendMonth;
    s.total += c.spendTotal;
    s.byProduct[c.product] = (s.byProduct[c.product] ?? 0) + c.spendMonth;
    if (c.active) s.activeCount += 1;
    map.set(c.currency, s);
  }
  return [...map.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}

async function loadMeta(): Promise<FinancePayload["meta"]> {
  const token = process.env.META_ADS_TOKEN?.trim();
  if (!token) return { status: "not_configured", campaigns: [], spend: [], accounts: [] };

  const ids = (process.env.META_AD_ACCOUNT_IDS ?? DEFAULT_AD_ACCOUNTS.join(","))
    .split(",")
    .map((id) => id.trim().replace(/^act_/, ""))
    .filter(Boolean);

  const results = await Promise.allSettled(ids.map((id) => loadAccount(id, token)));
  const accounts: FinancePayload["meta"]["accounts"] = [];
  const campaigns: Campaign[] = [];
  let authFailed = false;

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      accounts.push(r.value.account);
      campaigns.push(...r.value.campaigns);
    } else {
      const err = r.reason as MetaError;
      if (err?.auth) authFailed = true;
      console.error("[admin/finance] meta", ids[i], err?.message);
      accounts.push({ id: ids[i], name: ids[i], currency: "", error: err?.auth ? "Sin acceso" : "No respondió" });
    }
  });

  const order = (c: Campaign) => (c.active ? 0 : c.spendMonth > 0 ? 1 : 2);
  campaigns.sort((a, b) => order(a) - order(b) || b.spendTotal - a.spendTotal);

  const anyOk = results.some((r) => r.status === "fulfilled");
  return {
    status: anyOk ? "ok" : authFailed ? "auth_error" : "error",
    campaigns,
    spend: summarizeSpend(campaigns),
    accounts,
  };
}

/* ── Entry point ─────────────────────────────────────────────────────────── */
let cache: FinancePayload | null = null;

export async function loadFinance(force = false): Promise<FinancePayload> {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache;
  const [mp, meta] = await Promise.all([loadMercadoPago(), loadMeta()]);
  cache = { fetchedAt: Date.now(), mp, meta };
  return cache;
}
