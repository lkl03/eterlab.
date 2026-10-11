"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Megaphone, Repeat, TriangleAlert } from "lucide-react";
import type { Campaign, FinancePayload, Product, Subscription } from "../../lib/admin/finance";
import { CARD, EASE, ViewHeader, daysUntil, fmtDate, inDays, money, relTime, useNow, type ViewProps } from "./ui";

const PRODUCTS: Record<Product, { label: string; color: string }> = {
  nodo: { label: "nodo", color: "rgb(15,118,110)" },
  eterlab: { label: "eterlab.", color: "rgb(138,180,255)" },
  otro: { label: "Otro", color: "rgba(33,33,33,0.35)" },
};

const PRODUCT_ORDER: Product[] = ["eterlab", "nodo", "otro"];

/* ── Finance view ────────────────────────────────────────────────────────── */
export function FinanceView({ refreshKey, onBusy, onUnauthorized }: ViewProps) {
  const [data, setData] = useState<FinancePayload | null>(null);
  const [failed, setFailed] = useState(false);
  const now = useNow();

  const load = useCallback(
    async (fresh = false) => {
      onBusy(true);
      try {
        const res = await fetch(`/api/admin/finance${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        setData((await res.json()) as FinancePayload);
        setFailed(false);
      } catch {
        setFailed(true);
      } finally {
        onBusy(false);
      }
    },
    [onBusy, onUnauthorized],
  );

  useEffect(() => {
    load(refreshKey > 0);
  }, [load, refreshKey]);

  const degraded = !!data && (data.mp.status !== "ok" || data.meta.status !== "ok");

  return (
    <>
      <ViewHeader
        title="Finanzas"
        sync={
          data
            ? { tone: degraded || failed ? "warn" : "ok", text: <>MercadoPago y Meta Ads · {relTime(data.fetchedAt, now)}</> }
            : failed
              ? { tone: "warn", text: "No se pudieron leer los datos" }
              : { tone: "idle", text: "Leyendo MercadoPago y Meta Ads…" }
        }
      />

      {!data ? (
        failed ? (
          <Notice className="mt-10">No se pudieron leer los datos. Probá actualizar en unos segundos.</Notice>
        ) : (
          <FinanceSkeleton />
        )
      ) : (
        <>
          <FinanceKpis data={data} />
          <Revenue mp={data.mp} />
          <Ads meta={data.meta} />
        </>
      )}
    </>
  );
}

/* ── KPIs ────────────────────────────────────────────────────────────────── */
function FinanceKpis({ data }: { data: FinancePayload }) {
  const { revenue, subscriptions } = data.mp;
  const mpOk = data.mp.status === "ok";
  const main = revenue[0];
  const others = revenue.slice(1);

  const charged = new Map<string, number>();
  for (const s of subscriptions) if (s.chargedTotal) charged.set(s.currency, (charged.get(s.currency) ?? 0) + s.chargedTotal);
  const firstSince = subscriptions.map((s) => s.since).filter(Boolean).sort()[0];

  const spend = data.meta.spend;
  const metaOk = data.meta.status === "ok";
  const activeCampaigns = data.meta.campaigns.filter((c) => c.active).length;

  const kpis: Array<{ label: string; value: React.ReactNode; foot: string }> = [
    {
      label: "MRR",
      value: !mpOk ? "—" : main ? money(main.mrr, main.currency) : money(0, "ARS"),
      foot: !mpOk
        ? "MercadoPago sin conectar"
        : [
            main?.activeCount === 1 ? "1 suscripción activa" : `${main?.activeCount ?? 0} suscripciones activas`,
            ...others.map((o) => `+ ${money(o.mrr, o.currency)}`),
          ].join(" · "),
    },
    {
      label: "ARR",
      value: !mpOk ? "—" : money(main?.arr ?? 0, main?.currency ?? "ARS"),
      foot: !mpOk ? "MercadoPago sin conectar" : ["MRR × 12", ...others.map((o) => `+ ${money(o.arr, o.currency)}`)].join(" · "),
    },
    {
      label: "Cobrado a la fecha",
      value: !mpOk ? "—" : charged.size ? [...charged].map(([cur, n]) => money(n, cur)).join(" · ") : money(0, "ARS"),
      foot: !mpOk ? "MercadoPago sin conectar" : firstSince ? `Suscripciones desde ${fmtDate(firstSince, { day: false })}` : "Sin cobros todavía",
    },
    {
      label: "Ads este mes",
      value: !metaOk ? "—" : spend.length ? (
        <span className="flex flex-col gap-1">
          {spend.map((s) => (
            <span key={s.currency}>{money(s.month, s.currency)}</span>
          ))}
        </span>
      ) : (
        money(0, "ARS")
      ),
      foot: !metaOk
        ? "Meta Ads sin conectar"
        : activeCampaigns
          ? `${activeCampaigns} campaña${activeCampaigns === 1 ? "" : "s"} activa${activeCampaigns === 1 ? "" : "s"}`
          : "Ninguna campaña activa",
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
          <span className="mt-3 text-[24px] font-semibold leading-none tracking-tight tabular-nums sm:text-[32px]">{k.value}</span>
          <span className="mt-auto pt-3 text-xs leading-relaxed text-ink/50">{k.foot}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Revenue ─────────────────────────────────────────────────────────────── */
function Revenue({ mp }: { mp: FinancePayload["mp"] }) {
  return (
    <Section title="Ingresos recurrentes" subtitle="Suscripciones de MercadoPago" icon={<Repeat className="h-3.5 w-3.5" />} delay={0.12}>
      {mp.status !== "ok" ? (
        <SourceProblem
          status={mp.status}
          source="MercadoPago"
          envVar="MP_ACCESS_TOKEN"
          hint="Usá el Access Token de producción de la app de MercadoPago del admin."
        />
      ) : mp.subscriptions.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-ink/45 sm:px-6">Todavía no hay suscripciones en MercadoPago.</p>
      ) : (
        <>
          {mp.revenue.map((r) => (
            <ProductSplit
              key={r.currency}
              currency={r.currency}
              total={r.mrr}
              parts={PRODUCT_ORDER.filter((p) => r.byProduct[p]).map((p) => [p, r.byProduct[p]!])}
              caption="MRR por producto"
            />
          ))}
          <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_96px] gap-4 border-y border-ink/[0.07] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 md:grid">
            <span>Suscripción</span>
            <span>Monto</span>
            <span>Próximo cobro</span>
            <span>Cobrado</span>
            <span>Estado</span>
          </div>
          <ul className="border-t border-ink/[0.07] md:border-t-0">
            {mp.subscriptions.map((s) => (
              <SubscriptionRow key={s.id} sub={s} />
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

function ProductSplit({
  currency,
  total,
  parts,
  caption,
}: {
  currency: string;
  total: number;
  parts: Array<[Product, number]>;
  caption: string;
}) {
  if (!total) return null;
  return (
    <div className="px-5 pb-5 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">
        {caption} · {currency}
      </p>
      <div className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
        {parts.map(([p, n]) => (
          <span key={p} style={{ width: `${(n / total) * 100}%`, background: PRODUCTS[p].color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {parts.map(([p, n]) => (
          <li key={p} className="flex items-baseline gap-2 text-sm">
            <span className="h-2 w-2 translate-y-[-1px] rounded-full" style={{ background: PRODUCTS[p].color }} />
            <span className="font-semibold">{PRODUCTS[p].label}</span>
            <span className="tabular-nums text-ink/60">{money(n, currency)}</span>
            <span className="tabular-nums text-xs text-ink/40">{Math.round((n / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubscriptionRow({ sub: s }: { sub: Subscription }) {
  const next = s.nextPayment ? daysUntil(s.nextPayment) : null;
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-b border-ink/[0.07] px-5 py-4 last:border-b-0 sm:px-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_96px] md:items-center">
      <div className="min-w-0">
        <ProductTag product={s.product} />
        <p className="mt-1 truncate font-semibold tracking-tight">{s.reason}</p>
        {s.reference && <p className="truncate text-xs text-ink/45">Ref. {s.reference}</p>}
      </div>

      <div className="text-right md:text-left">
        <p className="font-semibold tabular-nums">{s.amount !== null ? money(s.amount, s.currency) : "—"}</p>
        <p className="text-xs text-ink/45">{s.frequencyLabel}</p>
      </div>

      <div className="text-sm text-ink/65">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40 md:hidden">Próximo cobro</p>
        {s.nextPayment && next !== null ? (
          <>
            <span className="tabular-nums">{fmtDate(s.nextPayment)}</span>
            <span className="block text-xs text-ink/45">{inDays(next)}</span>
          </>
        ) : (
          "—"
        )}
      </div>

      <div className="text-right text-sm text-ink/65 md:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40 md:hidden">Cobrado</p>
        {s.chargedTotal !== null ? (
          <>
            <span className="tabular-nums">{money(s.chargedTotal, s.currency)}</span>
            {s.chargedCount ? (
              <span className="block text-xs text-ink/45">
                {s.chargedCount} cobro{s.chargedCount === 1 ? "" : "s"}
                {s.since ? ` · desde ${fmtDate(s.since, { day: false })}` : ""}
              </span>
            ) : null}
          </>
        ) : (
          "—"
        )}
      </div>

      <div className="col-span-2 md:col-span-1">
        <StateChip active={s.active} label={s.statusLabel} />
      </div>
    </li>
  );
}

/* ── Ads ─────────────────────────────────────────────────────────────────── */
function Ads({ meta }: { meta: FinancePayload["meta"] }) {
  const active = meta.campaigns.filter((c) => c.active);
  const accountErrors = meta.accounts.filter((a) => a.error);

  return (
    <Section title="Ads" subtitle="Campañas de Meta Ads" icon={<Megaphone className="h-3.5 w-3.5" />} delay={0.18}>
      {meta.status !== "ok" ? (
        <SourceProblem
          status={meta.status}
          source="Meta Ads"
          envVar="META_ADS_TOKEN"
          hint="Generá un token de usuario del sistema con permiso ads_read en el Business Manager de Nodo."
        />
      ) : (
        <>
          <div className="grid gap-4 px-5 pb-5 sm:px-6 md:grid-cols-2">
            {meta.spend.map((s) => (
              <div key={s.currency} className="rounded-[20px] border border-ink/[0.08] bg-paper-muted/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">Gasto en {s.currency}</p>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <span className="text-2xl font-semibold tracking-tight tabular-nums">{money(s.month, s.currency)}</span>
                  <span className="text-xs text-ink/45">este mes</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-3 text-sm text-ink/60">
                  <span className="tabular-nums">{money(s.total, s.currency)}</span>
                  <span className="text-xs text-ink/45">histórico</span>
                </div>
              </div>
            ))}
          </div>

          {accountErrors.length > 0 && (
            <Notice className="mx-5 mb-5 sm:mx-6">
              {accountErrors.length === 1 ? "Una cuenta publicitaria" : `${accountErrors.length} cuentas publicitarias`} no
              respondieron ({accountErrors.map((a) => `${a.id}: ${a.error}`).join(", ")}). Revisá que el usuario del sistema
              tenga acceso.
            </Notice>
          )}

          {meta.campaigns.length > 0 && active.length === 0 && (
            <p className="mx-5 mb-4 rounded-2xl border border-dashed border-ink/15 px-4 py-3 text-sm text-ink/55 sm:mx-6">
              No hay campañas activas en este momento. Abajo están las pausadas, con lo que gastaron.
            </p>
          )}

          {meta.campaigns.length === 0 ? (
            <p className="px-5 pb-10 pt-4 text-center text-sm text-ink/45 sm:px-6">Las cuentas no tienen campañas.</p>
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_96px_20px] gap-4 border-y border-ink/[0.07] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 md:grid">
                <span>Campaña</span>
                <span>Presupuesto</span>
                <span>Este mes</span>
                <span>Histórico</span>
                <span>Estado</span>
                <span />
              </div>
              <ul className="border-t border-ink/[0.07] md:border-t-0">
                {meta.campaigns.map((c) => (
                  <CampaignRow key={c.id} campaign={c} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </Section>
  );
}

function CampaignRow({ campaign: c }: { campaign: Campaign }) {
  const budget =
    c.dailyBudget !== null
      ? `${money(c.dailyBudget, c.currency)}/día`
      : c.lifetimeBudget !== null
        ? `${money(c.lifetimeBudget, c.currency)} total`
        : "—";
  return (
    <li>
      <a
        href={c.href}
        target="_blank"
        rel="noreferrer"
        className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-b border-ink/[0.07] px-5 py-4 transition-colors hover:bg-ink/[0.025] sm:px-6 md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_96px_20px] md:items-center"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ProductTag product={c.product} />
            <span className="text-xs text-ink/40">{c.accountName}</span>
          </div>
          <p className="mt-1 truncate font-semibold tracking-tight">{c.name}</p>
          <p className="truncate text-xs text-ink/45">
            {[c.objective, c.startTime && `desde ${fmtDate(c.startTime)}`].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="md:hidden">
          <StateChip active={c.active} label={c.statusLabel} />
        </div>

        <div className="col-span-2 grid grid-cols-3 gap-3 md:contents">
          <Cell label="Presupuesto">{budget}</Cell>
          <Cell label="Este mes" strong>
            {money(c.spendMonth, c.currency)}
          </Cell>
          <Cell label="Histórico">{money(c.spendTotal, c.currency)}</Cell>
        </div>

        <div className="hidden md:block">
          <StateChip active={c.active} label={c.statusLabel} />
        </div>
        <ArrowUpRight className="hidden h-4 w-4 text-ink/30 transition-colors group-hover:text-ink md:block" />
      </a>
    </li>
  );
}

function Cell({ label, strong, children }: { label: string; strong?: boolean; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40 md:hidden">{label}</p>
      <span className={`tabular-nums ${strong ? "font-semibold text-ink" : "text-ink/65"}`}>{children}</span>
    </div>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────────────── */
function Section({
  title,
  subtitle,
  icon,
  delay,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      className={`${CARD} mt-6 overflow-hidden`}
    >
      <div className="flex items-center gap-3 p-5 sm:p-6">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/[0.06] text-ink/70">{icon}</span>
        <div>
          <h2 className="text-lg font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-sm text-ink/45">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ProductTag({ product }: { product: Product }) {
  const p = PRODUCTS[product];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-2 py-0.5 text-[11px] font-semibold text-ink/70">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
      {p.label}
    </span>
  );
}

function StateChip({ active, label }: { active: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-2.5 py-1 text-xs font-semibold text-ink/70">
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "eter-pulse bg-emerald-500 text-emerald-500/40" : "bg-ink/25"}`} />
      {label}
    </span>
  );
}

function Notice({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-start gap-2 rounded-2xl border border-amber-300/60 bg-amber-50/80 px-4 py-3 text-sm text-amber-900 ${className}`}>
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function SourceProblem({
  status,
  source,
  envVar,
  hint,
}: {
  status: string;
  source: string;
  envVar: string;
  hint: string;
}) {
  const text =
    status === "not_configured"
      ? `${source} todavía no está conectado. Falta la variable ${envVar} en Vercel.`
      : status === "auth_error"
        ? `${source} rechazó el token (${envVar}). Puede haber vencido o no tener permisos.`
        : `${source} no respondió. Probá actualizar en unos segundos.`;
  return (
    <div className="px-5 pb-6 sm:px-6">
      <Notice>
        {text} {status !== "error" && <span className="text-amber-900/75">{hint}</span>}
      </Notice>
    </div>
  );
}

function FinanceSkeleton() {
  return (
    <div className="mt-10 animate-pulse" aria-label="Cargando">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${CARD} h-[150px]`} />
        ))}
      </div>
      <div className={`${CARD} mt-6 h-[300px]`} />
      <div className={`${CARD} mt-6 h-[260px]`} />
    </div>
  );
}
