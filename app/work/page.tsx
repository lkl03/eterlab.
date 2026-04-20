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
import { FEATURED_SLIDESHOW_WORKS, type Work } from "../../lib/work";

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

  // Show all works featured in the homepage slideshow — keeps parity so
  // the mobile "ver todos" button and the landing section are in sync.
  const works = useMemo<Work[]>(() => FEATURED_SLIDESHOW_WORKS, []);

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

          {/* All featured works */}
          <div className="grid gap-8">
            {works.map((work) => {
              const coverSrc =
                work.coverByLang?.[lang] ?? work.coverImage ?? "/og.png";

              return (
                <div
                  key={work.slug}
                  className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
                >
                  <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-[0_12px_50px_rgba(17,17,26,0.08)]">
                    <Image
                      src={coverSrc}
                      alt={work.title}
                      width={1600}
                      height={1000}
                      className="h-full w-full object-cover"
                      priority={work.slug === works[0].slug}
                    />
                  </div>

                  <div className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_12px_50px_rgba(17,17,26,0.06)]">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                      {work.badge?.[lang] ?? ""}
                    </div>

                    <h2 className="eter-bubble-title mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {work.title}
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {work.summary?.[lang] ?? ""}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button variant="light" href={`/work/${work.slug}`} ariaLabel="Learn more">
                        {c.featured.ctaMore}
                      </Button>

                      {work.liveUrl ? (
                        <Button variant="dark" href={work.liveUrl} ariaLabel="Visit site">
                          {c.featured.ctaLive}
                          <ArrowUpRight size={16} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
