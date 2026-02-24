"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import MouseDot from "../../components/MouseDot";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { COPY, LANG_KEY, type Lang } from "../../lib/i18n";
import type { Work } from "../../lib/work";

type Props = {
  work: Work;
};

function splitParagraphs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function WorkPageClient({ work }: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("es");

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

  const c = COPY[lang];

  const beforeAfterEnabled = work.slug === "bioprotece3d";
  const beforeSrc = "/work/bioprotece3d-before.jpg";
  const afterSrc = "/work/bioprotece3d-after.jpg";

  const coverSrc = work.coverByLang?.[lang] ?? work.coverImage ?? "../../public/work/bioprotece3d-cover.svg";

  return (
    <div className="min-h-dvh bg-paperMuted text-ink">
      <Navbar lang={lang} onToggleLang={onToggleLang} mobileLangPill />
      <MouseDot />

      <main className="bg-paperMuted pt-16 sm:pt-20">
        <section className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-16">
          <div className="mb-6">
            <Button variant="light" onClick={() => router.push("/")}
              ariaLabel="Back"
            >
              <ArrowLeft size={16} />
              {c.nav.home}
            </Button>
          </div>

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
              <h1 className="eter-bubble-title mt-3 text-3xl font-semibold tracking-tight text-ink">{work.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{work.summary[lang]}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {work.liveUrl ? (
                  <Button variant="dark" href={work.liveUrl} ariaLabel="View site">
                    {c.work.liveLabel}
                    <ArrowUpRight size={16} />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-[min(1120px,calc(100%-2rem))] pb-10">
          <div className="grid gap-10">
            {work.sections.map((s, idx) => (
              <article
                key={idx}
                className="rounded-[28px] border border-ink/10 bg-paper p-6 shadow-[0_10px_40px_rgba(17,17,26,0.06)]"
              >
                <h2 className="eter-bubble-title text-xl font-semibold tracking-tight text-ink">{s.title[lang]}</h2>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink/60">
                  {splitParagraphs(s.body[lang]).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </article>
            ))}

            {beforeAfterEnabled ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-[0_12px_50px_rgba(17,17,26,0.08)]">
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                    before
                  </div>
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={beforeSrc} alt="Before" fill className="object-cover" />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-[0_12px_50px_rgba(17,17,26,0.08)]">
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                    after
                  </div>
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={afterSrc} alt="After" fill className="object-cover" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="mx-auto w-[min(860px,calc(100%-2rem))] pb-24">
          {work.liveUrl ? (
            <div className="flex justify-center">
              <Button variant="dark" href={work.liveUrl} ariaLabel="Visit site">
                {c.featured.ctaLive}
              </Button>
            </div>
          ) : null}
        </div>

        <Footer lang={lang} />
      </main>
    </div>
  );
}
