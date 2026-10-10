"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, CalendarClock, Check, ChevronDown, Copy, ListChecks, Loader2,
  LogOut, Plus, RefreshCw, Search, TriangleAlert,
} from "lucide-react";
import type { Client, StatusTone } from "../../lib/admin/clients";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SHELL = "mx-auto w-[min(1240px,calc(100%-2rem))]";
const CARD =
  "rounded-[26px] border border-ink/10 bg-white/75 shadow-[0_18px_70px_rgba(17,17,26,0.07)] backdrop-blur";

// The site's ethereal accents, plus ink for the tail.
const ACCENTS = ["rgb(138,180,255)", "rgb(255,139,211)", "rgb(164,148,255)", "rgba(33,33,33,0.8)", "rgba(33,33,33,0.3)"];

type LoadError = { code: "not_configured" | "no_access" | "upstream" | "network"; serviceAccount?: string | null; sheetUrl?: string };
type Payload = { clients: Client[]; fetchedAt: number; sheetUrl: string };

/* ── Formatting ──────────────────────────────────────────────────────────── */
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-01-26" → "26 ene 2026" (parts can be dropped: day / year). */
function fmtDate(iso: string, parts: { day?: boolean; year?: boolean } = {}) {
  const [y, m, d] = iso.split("-").map(Number);
  return [parts.day === false ? null : d, MONTHS[m - 1], parts.year === false ? null : y].filter((x) => x !== null).join(" ");
}

function daysUntil(iso: string) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - today) / 86_400_000);
}

function inDays(n: number) {
  if (n === 0) return "hoy";
  if (n === 1) return "mañana";
  if (n < 0) return `hace ${-n} días`;
  if (n < 60) return `en ${n} días`;
  const months = Math.round(n / 30.4);
  return `en ${months} meses`;
}

function relTime(ts: number, now: number) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "recién";
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return `hace ${h} h`;
}

function money(amount: number, currency: string | null) {
  const n = amount.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  return currency === "ARS" ? `$ ${n}` : `U$D ${n}`;
}

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/* ── Dashboard ───────────────────────────────────────────────────────────── */
export function AdminDashboard({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<LoadError | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusTone | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(
    async (fresh = false) => {
      setRefreshing(true);
      try {
        const res = await fetch(`/api/admin/clients${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
        if (res.status === 401) {
          onLogout();
          return;
        }
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError({ code: body.error ?? "upstream", serviceAccount: body.serviceAccount, sheetUrl: body.sheetUrl });
          return;
        }
        setError(null);
        setData(body as Payload);
      } catch {
        setError({ code: "network" });
      } finally {
        setRefreshing(false);
        setNow(Date.now());
      }
    },
    [onLogout],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Keep "actualizado hace…" honest, and pick up sheet edits when the tab comes back.
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible" && data && Date.now() - data.fetchedAt > 60_000) load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [data, load]);

  async function logout(forgetDevice: boolean) {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forgetDevice }),
    }).catch(() => {});
    onLogout();
  }

  const clients = useMemo(() => data?.clients ?? [], [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter !== "all" && c.status.tone !== filter) return false;
      if (!q) return true;
      return [c.number, c.name, c.url, c.source, c.notes, c.payment.raw, c.brand]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [clients, query, filter]);

  const sheetHref = data?.sheetUrl ?? error?.sheetUrl;

  return (
    <div className="relative min-h-[100svh] bg-paper text-ink">
      <div aria-hidden className="pointer-events-none fixed inset-0 eter-featured-bg opacity-70" />

      <TopBar email={email} sheetHref={sheetHref} refreshing={refreshing} onRefresh={() => load(true)} onLogout={logout} />

      <main className={`${SHELL} relative pb-20 pt-10 sm:pt-14`}>
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-1 text-xs font-semibold tracking-tight text-ink/70 backdrop-blur">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-ink/[0.06]">
                <Plus className="h-[14px] w-[14px]" />
              </span>
              client checklist
            </span>
            <h1 className="eter-bubble-title mt-5 text-[clamp(48px,7vw,88px)] font-semibold leading-[0.92] tracking-tight">
              Clientes
            </h1>
          </div>
          <p className="flex items-center gap-2 text-sm text-ink/50">
            <span className={`h-1.5 w-1.5 rounded-full ${error ? "bg-amber-500" : data ? "bg-emerald-500" : "bg-ink/25"}`} />
            {data ? (
              <>Sincronizado con Google Sheets · {relTime(data.fetchedAt, now)}</>
            ) : error ? (
              "Sin conexión con el Sheet"
            ) : (
              "Conectando con Google Sheets…"
            )}
          </p>
        </motion.header>

        {error && !data ? (
          <ErrorState error={error} onRetry={() => load(true)} retrying={refreshing} />
        ) : !data ? (
          <Skeleton />
        ) : (
          <>
            {error && (
              <div className="mt-8 flex items-center gap-2 rounded-2xl border border-amber-300/60 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                <TriangleAlert className="h-4 w-4 shrink-0" />
                No se pudo actualizar; mostrando los últimos datos.
              </div>
            )}

            <Kpis clients={clients} />

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
                className={`${CARD} min-w-0 self-start overflow-hidden`}
              >
                <div className="flex flex-col gap-4 border-b border-ink/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Cartera</h2>
                    <p className="text-sm text-ink/45">
                      {visible.length === clients.length
                        ? `${clients.length} ${clients.length === 1 ? "cliente" : "clientes"}`
                        : `${visible.length} de ${clients.length}`}
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar cliente, dominio, nota…"
                      aria-label="Buscar en la cartera"
                      className="h-10 w-full rounded-full border border-ink/10 bg-white/90 pl-10 pr-4 text-sm placeholder:text-ink/35 focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/[0.06]"
                    />
                  </div>
                </div>

                <StatusFilter clients={clients} value={filter} onChange={setFilter} />

                <div className="hidden grid-cols-[56px_minmax(0,1.7fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_96px_28px] gap-4 border-b border-ink/[0.07] px-6 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 md:grid">
                  <span>#</span>
                  <span>Cliente</span>
                  <span>Inicio</span>
                  <span>Pago</span>
                  <span>Origen</span>
                  <span>Estado</span>
                  <span />
                </div>

                {visible.length === 0 ? (
                  <p className="px-6 py-14 text-center text-sm text-ink/45">
                    {clients.length === 0 ? "La checklist todavía no tiene clientes." : "Ningún cliente coincide con la búsqueda."}
                  </p>
                ) : (
                  <ul>
                    {visible.map((c, i) => (
                      <ClientRow
                        key={`${c.number}-${c.name}`}
                        client={c}
                        index={i}
                        open={open === c.number + c.name}
                        onToggle={() => setOpen((o) => (o === c.number + c.name ? null : c.number + c.name))}
                      />
                    ))}
                  </ul>
                )}
              </motion.section>

              <aside className="flex flex-col gap-6">
                <Renewals clients={clients} />
                <Pending clients={clients} />
                <Timeline clients={clients} />
                <Glossary />
              </aside>
            </div>
          </>
        )}

        <footer className="mt-16 flex flex-col items-center gap-2 text-xs text-ink/35">
          <span className="font-logo text-xl text-ink/50">eterlab.</span>
          <span>Panel interno · solo lectura · los cambios se hacen en el Sheet</span>
        </footer>
      </main>
    </div>
  );
}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
function TopBar({
  email,
  sheetHref,
  refreshing,
  onRefresh,
  onLogout,
}: {
  email: string;
  sheetHref?: string;
  refreshing: boolean;
  onRefresh: () => void;
  onLogout: (forgetDevice: boolean) => void;
}) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const pill =
    "h-10 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white/90 text-sm font-semibold text-ink/75 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-200 hover:-translate-y-[1px] hover:text-ink";

  return (
    <div className="sticky top-0 z-30 border-b border-ink/[0.07] bg-white/70 backdrop-blur-xl">
      <div className={`${SHELL} flex h-16 items-center justify-between gap-3`}>
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ir a eterlab.co">
          <span className="font-logo select-none text-2xl leading-none text-ink">eterlab.</span>
          <span className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50">
            admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {sheetHref && (
            <a href={sheetHref} target="_blank" rel="noreferrer" className={`${pill} hidden px-4 sm:inline-flex`}>
              Abrir Sheet
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          <button type="button" onClick={onRefresh} disabled={refreshing} aria-label="Actualizar datos" className={`${pill} inline-flex w-10 shrink-0`}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-haspopup="menu"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-ink pl-1.5 pr-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-xs uppercase">{email.charAt(0)}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {menu && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl border border-ink/10 bg-white p-2 shadow-[0_18px_60px_rgba(17,17,26,0.14)]"
                >
                  <p className="truncate px-3 pb-2 pt-1.5 text-xs text-ink/45">{email}</p>
                  {sheetHref && (
                    <a
                      role="menuitem"
                      href={sheetHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-ink/80 hover:bg-ink/[0.05] sm:hidden"
                    >
                      Abrir Sheet <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => onLogout(false)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink/80 hover:bg-ink/[0.05]"
                  >
                    Cerrar sesión <LogOut className="h-4 w-4" />
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => onLogout(true)}
                    className="w-full rounded-xl px-3 py-2 text-left text-xs text-ink/50 hover:bg-ink/[0.05] hover:text-ink/80"
                  >
                    Cerrar sesión y olvidar este dispositivo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── KPIs ────────────────────────────────────────────────────────────────── */
function Kpis({ clients }: { clients: Client[] }) {
  const active = clients.filter((c) => c.status.tone === "active").length;

  const paid = clients.filter((c) => c.payment.amount !== null && c.payment.kind !== "recurring");
  const totals = new Map<string, number>();
  for (const c of paid) totals.set(c.payment.currency ?? "USD", (totals.get(c.payment.currency ?? "USD") ?? 0) + c.payment.amount!);
  const [mainCur, mainTotal] = [...totals.entries()].sort((a, b) => (a[0] === "USD" ? -1 : b[0] === "USD" ? 1 : 0))[0] ?? ["USD", 0];
  const otherTotals = [...totals.entries()].filter(([cur]) => cur !== mainCur);
  const trades = clients.filter((c) => c.payment.kind === "trade").length;
  const free = clients.filter((c) => c.payment.kind === "free").length;
  const monthly = clients.filter((c) => c.payment.kind === "recurring");

  const sources = groupCount(clients.map((c) => c.source ?? "Sin dato"));

  const upcoming = clients
    .filter((c) => c.domain.renewsOn && daysUntil(c.domain.renewsOn) >= 0)
    .sort((a, b) => a.domain.renewsOn!.localeCompare(b.domain.renewsOn!))[0];

  const kpis = [
    {
      label: "Clientes activos",
      value: (
        <>
          {active}
          <span className="text-ink/25">/{clients.length}</span>
        </>
      ),
      foot: active === clients.length ? "Toda la cartera está activa" : `${clients.length - active} sin estado activo`,
    },
    {
      label: "Facturado",
      value: money(mainTotal, mainCur),
      foot:
        [
          `${paid.length} ${paid.length === 1 ? "pago" : "pagos"}`,
          trades ? `${trades} canje${trades === 1 ? "" : "s"}` : null,
          free ? `${free} sin cargo` : null,
          monthly.length ? `${monthly.length} mensual${monthly.length === 1 ? "" : "es"}` : null,
          ...otherTotals.map(([cur, n]) => `+ ${money(n, cur)}`),
        ]
          .filter(Boolean)
          .join(" · "),
    },
    {
      label: "Cómo nos conocieron",
      value: sources[0] ? `${Math.round((sources[0][1] / clients.length) * 100)}%` : "—",
      foot: sources[0] ? `Canal principal: ${sources[0][0]}` : "Sin datos",
      extra: <SourceBar sources={sources} total={clients.length} />,
    },
    {
      label: "Próxima renovación",
      value: upcoming ? fmtDate(upcoming.domain.renewsOn!, { year: false }) : "—",
      foot: upcoming
        ? `${upcoming.name} · ${upcoming.domain.renewsOn!.slice(0, 4)} · ${inDays(daysUntil(upcoming.domain.renewsOn!))}`
        : "Sin fechas cargadas",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.04 * i }}
          className={`${CARD} flex min-w-0 flex-col p-4 sm:p-6`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45 sm:text-[11px]">{k.label}</span>
          <span className="mt-3 whitespace-nowrap text-[26px] sm:text-[34px] font-semibold leading-none tracking-tight tabular-nums">{k.value}</span>
          {k.extra}
          <span className="mt-auto pt-3 text-xs leading-relaxed text-ink/50">{k.foot}</span>
        </motion.div>
      ))}
    </div>
  );
}

function groupCount(values: string[]): Array<[string, number]> {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function SourceBar({ sources, total }: { sources: Array<[string, number]>; total: number }) {
  if (!total) return null;
  return (
    <div className="mt-4">
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        {sources.map(([name, n], i) => (
          <span key={name} style={{ width: `${(n / total) * 100}%`, background: ACCENTS[i % ACCENTS.length] }} />
        ))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
        {sources.map(([name, n], i) => (
          <li key={name} className="flex items-center gap-1.5 text-[11px] text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENTS[i % ACCENTS.length] }} />
            {name} <span className="tabular-nums text-ink/35">{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Status ──────────────────────────────────────────────────────────────── */
const TONE_DOT: Record<StatusTone, string> = {
  active: "bg-emerald-500 text-emerald-500/40 eter-pulse",
  paused: "bg-amber-400",
  pending: "bg-[rgb(138,180,255)]",
  inactive: "bg-ink/25",
  other: "bg-[rgb(164,148,255)]",
};

function StatusChip({ status }: { status: Client["status"] }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-2.5 py-1 text-xs font-semibold text-ink/70">
      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[status.tone]}`} />
      {status.label}
    </span>
  );
}

function StatusFilter({
  clients,
  value,
  onChange,
}: {
  clients: Client[];
  value: StatusTone | "all";
  onChange: (v: StatusTone | "all") => void;
}) {
  const tones = groupCount(clients.map((c) => c.status.tone)) as Array<[StatusTone, number]>;
  if (tones.length < 2) return null;
  const labelOf = (t: StatusTone) => clients.find((c) => c.status.tone === t)!.status.label;
  const options: Array<[StatusTone | "all", string, number]> = [["all", "Todos", clients.length], ...tones.map(([t, n]) => [t, labelOf(t), n] as [StatusTone, string, number])];

  return (
    <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-6">
      {options.map(([t, label, n]) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={value === t}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            value === t ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/60 hover:text-ink"
          }`}
        >
          {label} <span className="tabular-nums opacity-60">{n}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Payment ─────────────────────────────────────────────────────────────── */
function PaymentBadge({ payment }: { payment: Client["payment"] }) {
  const { kind, amount, currency, label, detail } = payment;
  if (kind === "free") {
    return <span className="inline-flex rounded-full border border-dashed border-ink/20 px-2.5 py-1 text-xs font-semibold text-ink/50">Sin cargo</span>;
  }
  if (kind === "trade") {
    return (
      <span className="flex flex-col items-start gap-1">
        <span className="inline-flex rounded-full bg-[linear-gradient(90deg,rgba(138,180,255,0.28),rgba(255,139,211,0.28))] px-2.5 py-1 text-xs font-semibold text-ink/80">
          Canje
        </span>
        {detail && <span className="pl-1 text-[11px] text-ink/45">{sentence(detail)}</span>}
      </span>
    );
  }
  if (amount !== null) {
    return (
      <span className="flex flex-col items-start gap-1">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
            kind === "recurring" ? "bg-[rgba(164,148,255,0.22)] text-ink/85" : "bg-ink text-white"
          }`}
        >
          {money(amount, currency)}
          {kind === "recurring" ? "/mes" : ""}
        </span>
        <span className="pl-1 text-[11px] text-ink/45">{label}</span>
      </span>
    );
  }
  return <span className="text-xs font-semibold text-ink/60">{payment.raw || "—"}</span>;
}

/* ── Client row ──────────────────────────────────────────────────────────── */
function ProjectIcon({ kind }: { kind: "vercel" | "github" | "other" }) {
  if (kind === "vercel") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M12 2 23 21H1z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
        />
      </svg>
    );
  }
  return <ArrowUpRight className="h-4 w-4" />;
}

function ClientRow({ client: c, index, open, onToggle }: { client: Client; index: number; open: boolean; onToggle: () => void }) {
  const detailId = `client-${index}-detail`;
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.16 + index * 0.04 }}
      className="border-b border-ink/[0.07] last:border-b-0"
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`group grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-ink/[0.025] focus-visible:bg-ink/[0.035] focus-visible:outline-none sm:px-6 md:grid-cols-[56px_minmax(0,1.7fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_96px_28px] md:items-center ${
          open ? "bg-ink/[0.025]" : ""
        }`}
      >
        <span className="hidden font-semibold tabular-nums text-ink/35 md:block">{c.number}</span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-ink/35 md:hidden">{c.number}</span>
            <span className="truncate font-semibold tracking-tight">{c.name}</span>
          </div>
          {c.href ? (
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-sm text-ink/50 underline-offset-4 hover:text-ink hover:underline"
            >
              <span className="truncate">{c.url}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            c.url && <span className="text-sm text-ink/50">{c.url}</span>
          )}
        </div>

        <div className="flex items-start justify-end md:hidden">
          <StatusChip status={c.status} />
        </div>

        {/* Mobile: compact meta line */}
        <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:hidden">
          <PaymentBadge payment={c.payment} />
          <span className="text-xs text-ink/50">{c.start.iso ? fmtDate(c.start.iso) : c.start.raw}</span>
          {c.source && <span className="text-xs text-ink/50">{c.source}</span>}
        </div>

        <span className="hidden text-sm tabular-nums text-ink/65 md:block">{c.start.iso ? fmtDate(c.start.iso) : c.start.raw || "—"}</span>
        <span className="hidden md:block">
          <PaymentBadge payment={c.payment} />
        </span>
        <span className="hidden truncate text-sm text-ink/65 md:block">{c.source ?? "—"}</span>
        <span className="hidden md:block">
          <StatusChip status={c.status} />
        </span>
        <span className="hidden justify-end md:flex">
          <ChevronDown className={`h-4 w-4 text-ink/35 transition-transform duration-300 group-hover:text-ink ${open ? "rotate-180" : ""}`} />
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={detailId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <ClientDetail client={c} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function ClientDetail({ client: c }: { client: Client }) {
  const domainLine = [
    c.domain.registrar && `en ${c.domain.registrar}`,
    c.domain.renewsOn && `renueva el ${fmtDate(c.domain.renewsOn)} (${inDays(daysUntil(c.domain.renewsOn))})`,
    c.domain.managedBy && `a cargo de ${c.domain.managedBy}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const facts: Array<[string, React.ReactNode]> = [
    ["Pago (Sheet)", c.payment.raw || "—"],
    ["Plan", c.plan ?? "—"],
    ["Marca", c.brand ?? "—"],
    ["Dominio", domainLine ? sentence(domainLine) : "—"],
    ...Object.entries(c.extra).map(([k, v]) => [k, v] as [string, React.ReactNode]),
  ];

  return (
    <div className="grid gap-5 px-5 pb-6 pt-1 sm:px-6 md:grid-cols-[56px_minmax(0,1fr)]">
      <span className="hidden md:block" />
      <div className="grid gap-5 rounded-[20px] border border-ink/[0.08] bg-paper-muted/70 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-ink/45">{k}</dt>
              <dd className="font-semibold text-ink/80">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">Observaciones</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{c.notes ?? "Sin observaciones."}</p>
          </div>
          {c.pending.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {c.pending.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-semibold text-ink/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgb(255,139,211)]" />
                  Pendiente: {p}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-wrap gap-2">
            {c.href && (
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 text-xs font-semibold text-ink/75 transition-all hover:-translate-y-[1px] hover:text-ink"
              >
                Ver sitio <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {c.project && (
              <a
                href={c.project.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-white transition-all hover:-translate-y-[1px]"
              >
                <ProjectIcon kind={c.project.kind} />
                {c.project.kind === "vercel" ? "Proyecto en Vercel" : c.project.kind === "github" ? "Repo en GitHub" : "Proyecto"}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Side cards ──────────────────────────────────────────────────────────── */
function SideCard({ title, icon, delay, children }: { title: string; icon: React.ReactNode; delay: number; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      className={`${CARD} p-5 sm:p-6`}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/[0.06] text-ink/70">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}

function Renewals({ clients }: { clients: Client[] }) {
  const dated = clients
    .filter((c) => c.domain.renewsOn)
    .map((c) => ({ c, days: daysUntil(c.domain.renewsOn!) }))
    .sort((a, b) => a.days - b.days);
  const undated = clients.filter((c) => !c.domain.renewsOn && (c.domain.registrar || c.domain.managedBy));

  return (
    <SideCard title="Renovaciones de dominio" icon={<CalendarClock className="h-3.5 w-3.5" />} delay={0.16}>
      {dated.length === 0 && undated.length === 0 ? (
        <p className="text-sm text-ink/45">No hay dominios con fecha en las observaciones.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {dated.map(({ c, days }) => {
            const soon = days < 60;
            const pct = Math.min(100, Math.max(3, ((365 - days) / 365) * 100));
            return (
              <li key={c.number + c.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{c.name}</span>
                  <span className={`shrink-0 text-xs font-semibold tabular-nums ${days < 0 ? "text-red-600" : soon ? "text-amber-600" : "text-ink/45"}`}>
                    {inDays(days)}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[0.07]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: days < 0 ? "rgb(220,38,38)" : soon ? "rgb(245,158,11)" : "linear-gradient(90deg, rgb(138,180,255), rgb(164,148,255))",
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink/45">
                  {fmtDate(c.domain.renewsOn!)}
                  {c.domain.registrar ? ` · ${c.domain.registrar}` : ""}
                </p>
              </li>
            );
          })}
          {undated.map((c) => (
            <li key={c.number + c.name} className="flex items-baseline justify-between gap-3 border-t border-dashed border-ink/10 pt-3">
              <span className="truncate text-sm font-semibold text-ink/70">{c.name}</span>
              <span className="shrink-0 text-[11px] text-ink/45">
                {[c.domain.registrar, c.domain.managedBy && `a cargo de ${c.domain.managedBy}`].filter(Boolean).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SideCard>
  );
}

function Pending({ clients }: { clients: Client[] }) {
  const items = clients.flatMap((c) => c.pending.map((p) => ({ c, p })));
  return (
    <SideCard title="Pendientes" icon={<ListChecks className="h-3.5 w-3.5" />} delay={0.2}>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-ink/50">
          <Check className="h-4 w-4 text-emerald-500" /> Nada pendiente en las observaciones.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map(({ c, p }) => (
            <li key={c.number + p} className="flex items-start gap-3 rounded-2xl border border-ink/[0.08] bg-white/80 p-3">
              <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-[1.5px] border-ink/25" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug">{p}</span>
                <span className="text-xs text-ink/45">{c.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </SideCard>
  );
}

function Timeline({ clients }: { clients: Client[] }) {
  const dated = clients.filter((c) => c.start.iso).sort((a, b) => a.start.iso!.localeCompare(b.start.iso!));
  if (dated.length === 0) return null;

  return (
    <SideCard title="Cronología" icon={<Plus className="h-3.5 w-3.5" />} delay={0.24}>
      <ol className="relative ml-1.5 border-l border-ink/10">
        {dated.map((c, i) => (
          <li key={c.number + c.name} className="relative pb-4 pl-5 last:pb-0">
            <span
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white"
              style={{ background: i === dated.length - 1 ? "rgb(33,33,33)" : ACCENTS[i % 3] }}
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40">
              {fmtDate(c.start.iso!, { day: false })}
            </p>
            <p className="text-sm font-semibold">{c.name}</p>
          </li>
        ))}
      </ol>
    </SideCard>
  );
}

function Glossary() {
  return (
    <div className="px-2 text-xs leading-relaxed text-ink/45">
      <p>
        <span className="font-semibold text-ink/65">OTP</span> = one-time payment (pago único).{" "}
        <span className="font-semibold text-ink/65">Canje</span> = pago único sin dinero (servicio a cambio).
      </p>
    </div>
  );
}

/* ── States ──────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="mt-10 animate-pulse" aria-label="Cargando">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${CARD} h-[150px]`} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className={`${CARD} h-[420px]`} />
        <div className="flex flex-col gap-6">
          <div className={`${CARD} h-[200px]`} />
          <div className={`${CARD} h-[150px]`} />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry, retrying }: { error: LoadError; onRetry: () => void; retrying: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!error.serviceAccount) return;
    try {
      await navigator.clipboard.writeText(error.serviceAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the email is still selectable */
    }
  };

  const content =
    error.code === "no_access"
      ? {
          title: "Falta compartir el Sheet",
          body: "El panel lee la checklist con una cuenta de servicio de Google. Compartí el Sheet con este email como Lector y actualizá.",
        }
      : error.code === "not_configured"
        ? {
            title: "Google Sheets no está configurado",
            body: "Falta la variable GOOGLE_SERVICE_ACCOUNT_KEY en este entorno.",
          }
        : {
            title: "No se pudo leer la checklist",
            body: "Google Sheets no respondió. Probá de nuevo en unos segundos.",
          };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`${CARD} mx-auto mt-12 max-w-xl p-7 sm:p-9`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700">
        <TriangleAlert className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-xl font-semibold tracking-tight">{content.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{content.body}</p>

      {error.code === "no_access" && error.serviceAccount && (
        <button
          type="button"
          onClick={copy}
          className="mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-paper-muted px-4 py-3 text-left font-mono text-xs text-ink/80 transition-colors hover:border-ink/25"
        >
          <span className="break-all">{error.serviceAccount}</span>
          {copied ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <Copy className="h-4 w-4 shrink-0 text-ink/40" />}
        </button>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-all hover:-translate-y-[1px] disabled:opacity-60"
        >
          {retrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Reintentar
        </button>
        {error.sheetUrl && (
          <a
            href={error.sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-white px-5 text-sm font-semibold text-ink/75 transition-all hover:-translate-y-[1px] hover:text-ink"
          >
            Abrir Sheet <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

