"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import MouseDot from "../../components/MouseDot";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { ScrollPreview } from "../../components/ui/ScrollPreview";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import CaseStudyView from "./CaseStudyView";
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

/** Renders "- " lines as a bullet list and everything else as paragraphs. */
function Body({ text }: { text: string }) {
  const blocks: Array<{ kind: "p"; text: string } | { kind: "ul"; items: string[] }> = [];
  for (const line of splitParagraphs(text)) {
    if (line.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === "ul") last.items.push(line.slice(2));
      else blocks.push({ kind: "ul", items: [line.slice(2)] });
    } else {
      blocks.push({ kind: "p", text: line });
    }
  }
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === "p" ? (
          <p key={i}>{b.text}</p>
        ) : (
          <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-ink/30">
            {b.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        )
      )}
    </>
  );
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

  const coverSrc = work.coverByLang?.[lang] ?? work.coverImage ?? "/work/bioprotece3d-cover.svg";
  const { ref: previewRef, bind: previewBind, active: previewActive } = useHoverPreview<HTMLDivElement>();
  const cs = work.caseStudy;

  if (cs) {
    const dark = cs.theme === "dark";
    return (
      <div className={dark ? "min-h-dvh bg-[#111112] text-white" : "min-h-dvh bg-paperMuted text-ink"}>
        <Navbar lang={lang} onToggleLang={onToggleLang} mobileLangPill />
        <MouseDot />
        <main className="pt-16 sm:pt-20">
          <CaseStudyView work={work} cs={cs} lang={lang} />
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
          <div className="mb-6">
            <Button variant="light" onClick={() => router.push("/")}
              ariaLabel="Back"
            >
              <ArrowLeft size={16} />
              {c.nav.home}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {work.preview ? (
              <div
                ref={previewRef}
                {...previewBind}
                className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-ink/10 bg-paper shadow-[0_12px_50px_rgba(17,17,26,0.08)]"
              >
                <ScrollPreview
                  video={work.preview}
                  poster={work.previewPoster ?? coverSrc}
                  alt={work.title}
                  active={previewActive}
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-top"
                />
              </div>
            ) : (
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
            )}

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
                  <Body text={s.body[lang]} />
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
