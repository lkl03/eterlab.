"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const SHELL = "mx-auto w-[min(1240px,calc(100%-2rem))]";
export const CARD =
  "rounded-[26px] border border-ink/10 bg-white/75 shadow-[0_18px_70px_rgba(17,17,26,0.07)] backdrop-blur";

// The site's ethereal accents, plus ink for the tail.
export const ACCENTS = ["rgb(138,180,255)", "rgb(255,139,211)", "rgb(164,148,255)", "rgba(33,33,33,0.8)", "rgba(33,33,33,0.3)"];

/* ── Formatting ──────────────────────────────────────────────────────────── */
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-01-26" → "26 ene 2026" (parts can be dropped: day / year). */
export function fmtDate(iso: string, parts: { day?: boolean; year?: boolean } = {}) {
  const [y, m, d] = iso.split("-").map(Number);
  return [parts.day === false ? null : d, MONTHS[m - 1], parts.year === false ? null : y].filter((x) => x !== null).join(" ");
}

export function daysUntil(iso: string) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - today) / 86_400_000);
}

export function inDays(n: number) {
  if (n === 0) return "hoy";
  if (n === 1) return "mañana";
  if (n < 0) return `hace ${-n} días`;
  if (n < 60) return `en ${n} días`;
  const months = Math.round(n / 30.4);
  return `en ${months} meses`;
}

export function relTime(ts: number, now: number) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "recién";
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  return `hace ${h} h`;
}

export function money(amount: number, currency: string | null) {
  const cents = !Number.isInteger(amount);
  const n = amount.toLocaleString("es-AR", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
  return currency === "ARS" ? `$ ${n}` : `U$D ${n}`;
}

export const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/* ── Shared cards ──────────────────────────────────────────────────────────── */
export function SideCard({ title, icon, delay, children }: { title: string; icon: React.ReactNode; delay: number; children: React.ReactNode }) {
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

/* ── View header ─────────────────────────────────────────────────────────── */
export type SyncTone = "ok" | "warn" | "idle";

export function ViewHeader({ title, sync }: { title: string; sync: { tone: SyncTone; text: React.ReactNode } }) {
  const dot = sync.tone === "ok" ? "bg-emerald-500" : sync.tone === "warn" ? "bg-amber-500" : "bg-ink/25";
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE }}
      className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <h1 className="eter-bubble-title text-[clamp(48px,7vw,88px)] font-semibold leading-[0.92] tracking-tight">{title}</h1>
      <p className="flex items-center gap-2 text-sm text-ink/50">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
        {sync.text}
      </p>
    </motion.header>
  );
}

/** Re-renders every 30 s so relative times ("hace 3 min") stay honest. */
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

/** Shell ↔ view contract: the top bar's refresh button and spinner. */
export type ViewProps = {
  /** Bumped by the top bar's refresh button; views reload fresh when it changes. */
  refreshKey: number;
  onBusy: (busy: boolean) => void;
  onUnauthorized: () => void;
};
