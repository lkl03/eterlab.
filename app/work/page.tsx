"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import MouseDot from "../../components/MouseDot";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { COPY, LANG_KEY, type Lang } from "../../lib/i18n";
import { WORKS } from "../../lib/work";

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

  // ✅ Solo mostramos Bioprotece3D en /work
  const work = useMemo(() => WORKS.find((w) => w.slug === "bioprotece3d"), []);

  if (!work) {
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

  // ✅ Cover por idioma (ES/EN), fallback al coverImage (y si no, /og.png)
  const coverSrc =
    work.coverByLang?.[lang] ??
    work.coverImage ??
    "/og.png";

  return (
    <div className="min-h-dvh bg-paperMuted text-ink">
      {/* Igual que /work/[slug]: sin SideMenu, con pill mobile */}
      <Navbar lang={lang} onToggleLang={onToggleLang} mobileLangPill />
      <MouseDot />

      <main className="bg-paperMuted pt-16 sm:pt-20">
        <section className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-16">
          {/* Back to home (igual que slug) */}
          <div className="mb-6">
            <Button variant="light" onClick={() => router.push("/")} ariaLabel="Back">
              <ArrowLeft size={16} />
              {c.nav.home}
            </Button>
          </div>

          {/* Card layout igual al header de WorkPageClient */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-[0_12px_50px_rgba(17,17,26,0.08)]">
              <Image
                src={coverSrc}
                alt={work.title}
                width={1600}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_12px_50px_rgba(17,17,26,0.06)]">
              {/* badge */}
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                {work.badge?.[lang] ?? ""}
              </div>

              <h1 className="eter-bubble-title mt-3 text-3xl font-semibold tracking-tight text-ink">
                {work.title}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {work.summary?.[lang] ?? ""}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {/* Learn more -> abre el case/page del proyecto */}
                <Button variant="light" href={`/work/${work.slug}`} ariaLabel="Learn more">
                  {c.featured.ctaMore}
                </Button>

                {/* Visit site -> liveUrl */}
                {work.liveUrl ? (
                  <Button variant="dark" href={work.liveUrl} ariaLabel="Visit site">
                    {c.featured.ctaLive}
                    <ArrowUpRight size={16} />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
