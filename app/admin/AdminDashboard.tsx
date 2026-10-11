"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, LogOut, RefreshCw } from "lucide-react";
import { ClientsView } from "./ClientsView";
import { FinanceView } from "./FinanceView";
import { EASE, SHELL } from "./ui";

export type AdminView = "clientes" | "finanzas";

const VIEWS: Array<{ id: AdminView; label: string }> = [
  { id: "clientes", label: "Clientes" },
  { id: "finanzas", label: "Finanzas" },
];

/* ── Dashboard shell ─────────────────────────────────────────────────────── */
export function AdminDashboard({
  email,
  sheetUrl,
  initialView,
  onLogout,
}: {
  email: string;
  sheetUrl: string;
  initialView: AdminView;
  onLogout: () => void;
}) {
  const [view, setView] = useState<AdminView>(initialView);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busy, setBusy] = useState(false);

  // Keep the active tab in the URL so a reload (or a shared link) lands on it.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (view === "clientes") url.searchParams.delete("vista");
    else url.searchParams.set("vista", view);
    window.history.replaceState(null, "", url);
  }, [view]);

  async function logout(forgetDevice: boolean) {
    await fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forgetDevice }),
    }).catch(() => {});
    onLogout();
  }

  // Views list these in effect deps, so they must keep a stable identity.
  const onLogoutRef = useRef(onLogout);
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);
  const onUnauthorized = useCallback(() => onLogoutRef.current(), []);
  const onBusy = useCallback((b: boolean) => setBusy(b), []);
  const viewProps = { refreshKey, onBusy, onUnauthorized };

  return (
    <div className="relative min-h-[100svh] bg-paper text-ink">
      <div aria-hidden className="pointer-events-none fixed inset-0 eter-featured-bg opacity-70" />

      <TopBar
        email={email}
        sheetHref={view === "clientes" ? sheetUrl : undefined}
        refreshing={busy}
        onRefresh={() => setRefreshKey((k) => k + 1)}
        onLogout={logout}
      />

      <main className={`${SHELL} relative pb-20 pt-8 sm:pt-12`}>
        <ViewTabs
          value={view}
          onChange={(v) => {
            setView(v);
            setRefreshKey(0);
          }}
        />

        {view === "clientes" ? <ClientsView key="clientes" {...viewProps} /> : <FinanceView key="finanzas" {...viewProps} />}

        <footer className="mt-16 flex flex-col items-center gap-2 text-xs text-ink/35">
          <span className="font-logo text-xl text-ink/50">eterlab.</span>
          <span>
            {view === "clientes"
              ? "Panel interno · solo lectura · los cambios se hacen en el Sheet"
              : "Panel interno · solo lectura · datos de MercadoPago y Meta Ads"}
          </span>
        </footer>
      </main>
    </div>
  );
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */
function ViewTabs({ value, onChange }: { value: AdminView; onChange: (v: AdminView) => void }) {
  return (
    <nav aria-label="Secciones del panel" className="inline-flex rounded-full border border-ink/10 bg-white/80 p-1 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] backdrop-blur">
      {VIEWS.map((v) => {
        const active = v.id === value;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
              active ? "text-white" : "text-ink/55 hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="admin-tab"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
            <span className="relative">{v.label}</span>
          </button>
        );
      })}
    </nav>
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
