"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Navbar from "../../components/Navbar";
import MouseDot from "../../components/MouseDot";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { COPY, LANG_KEY, type Lang } from "../../lib/i18n";
import { CLIENT_WORKS, type Work } from "../../lib/work";
import { WorkCard } from "../../components/work/WorkCard";

export default function WorkIndexPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("es");
  const c = COPY[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "es" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const onToggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };

  // Every client case study: the homepage spotlight first, then the grid.
  const works = useMemo<Work[]>(() => CLIENT_WORKS, []);

  if (works.length === 0) {
    return (
      <div className="min-h-dvh bg-paperMuted text-ink">
        <Navbar lang={lang} onToggleLang={onToggleLang} mobileLangPill />
        <MouseDot />
        <main className="bg-paperMuted pt-16 sm:pt-20">
          <section className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-16">
            <div className="mb-6">
              <Button variant="light" onClick={() => router.push("/")} ariaLabel="Back">
                <ArrowLeft size={16} />
                {c.nav.home}
              </Button>
            </div>

            <div className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_12px_50px_rgba(17,17,26,0.06)]">
              <p className="text-sm text-ink/60">No work found.</p>
            </div>
          </section>

          <Footer lang={lang} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paperMuted text-ink">
      <Navbar lang={lang} onToggleLang={onToggleLang} mobileLangPill />
      <MouseDot />

      <main className="bg-paperMuted pt-16 sm:pt-20">
        <section className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-16">
          {/* Back to home */}
          <div className="mb-6">
            <Button variant="light" onClick={() => router.push("/")} ariaLabel="Back">
              <ArrowLeft size={16} />
              {c.nav.home}
            </Button>
          </div>

          {/* Page heading */}
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
              {c.workIndex.tag}
            </div>
            <h1 className="eter-bubble-title mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {c.workIndex.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
              {c.workIndex.desc}
            </p>
          </div>

          {/* All client work — same cards as the homepage grid (six fill 3×2 / 2×3 evenly) */}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {works.map((work, i) => (
              <WorkCard key={work.slug} work={work} lang={lang} index={i} />
            ))}
          </ul>
        </section>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
