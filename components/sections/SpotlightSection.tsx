"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { COPY, type Lang } from "../../lib/i18n";
import { playfair } from "../../lib/fonts";
import { SPOTLIGHT_WORK } from "../../lib/work";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import { Reveal } from "../ui/Reveal";
import { ScrollPreview } from "../ui/ScrollPreview";

type Props = {
  lang: Lang;
};

/**
 * Single-project spotlight right below the hero (currently JINETES × eterlab).
 *
 * The section keeps eterlab's own background; the project lives inside a card
 * that borrows the client's register — monochrome, a Didone headline and a
 * desert horizon, as in the Instagram case study. Everything comes from
 * SPOTLIGHT_WORK, so swapping the spotlight is a one-line change in lib/work.ts.
 */
export default function SpotlightSection({ lang }: Props) {
  const c = COPY[lang];
  const work = SPOTLIGHT_WORK;
  const cs = work.caseStudy;
  const { ref, bind, active } = useHoverPreview<HTMLAnchorElement>();

  const host = work.liveUrl ? new URL(work.liveUrl).host.replace(/^www\./, "") : work.title;

  return (
    <section id="spotlight" aria-labelledby="spotlight-title" className="relative overflow-hidden bg-paper py-20 sm:py-28">
      {/* starts on the hero's bottom tone so there's no seam between the two */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_10%,rgba(138,180,255,0.10),transparent_60%),radial-gradient(800px_circle_at_85%_60%,rgba(255,139,211,0.08),transparent_60%),linear-gradient(180deg,rgb(247_247_250),rgb(255_255_255)_55%)]"
      />

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#111112] px-5 py-12 text-white shadow-[0_30px_120px_rgba(17,17,26,0.22)] sm:rounded-[36px] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          {/* soft key light + desert horizon, echoing the case-study carousel */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_75%_20%,rgba(255,255,255,0.07),transparent_60%),radial-gradient(700px_circle_at_10%_90%,rgba(255,255,255,0.04),transparent_60%)]"
          />
          <svg
            aria-hidden
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] w-full sm:h-[180px]"
          >
            <path d="M0 150 C 220 95, 420 130, 640 110 S 1060 60, 1440 120 L1440 220 L0 220 Z" fill="rgba(255,255,255,0.035)" />
            <path d="M0 185 C 260 150, 520 175, 800 160 S 1200 140, 1440 170 L1440 220 L0 220 Z" fill="rgba(255,255,255,0.045)" />
            {/* saguaros */}
            <g fill="rgba(0,0,0,0.55)">
              <path d="M120 220 V150 a9 9 0 0 1 18 0 V220 Z M120 185 h-14 a7 7 0 0 1 -7 -7 v-14 a5 5 0 0 1 10 0 v11 h11 Z M138 175 h12 v-12 a5 5 0 0 1 10 0 v15 a7 7 0 0 1 -7 7 h-15 Z" />
              <path d="M1290 220 V165 a7 7 0 0 1 14 0 V220 Z M1290 195 h-10 a6 6 0 0 1 -6 -6 v-10 a4 4 0 0 1 8 0 v8 h8 Z" />
            </g>
          </svg>

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-8">
            {/* intro: pill, lockup, headline */}
            <div className="lg:self-end">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-tight text-white/80 backdrop-blur">
                  <span className="eter-pulse h-1.5 w-1.5 rounded-full bg-white text-white/50" />
                  {c.spotlight.pill}
                </span>
              </Reveal>

              {cs ? (
                <Reveal delay={0.05}>
                  <div className="mt-8 flex items-center gap-4 sm:gap-5">
                    <Image
                      src={cs.partnerLogo.src}
                      alt={cs.partnerLogo.alt}
                      width={cs.partnerLogo.width}
                      height={cs.partnerLogo.height}
                      className="h-16 w-auto sm:h-20"
                    />
                    <span aria-hidden className="text-lg text-white/40">
                      ×
                    </span>
                    <span className="font-logo text-[40px] leading-none tracking-tight text-white sm:text-5xl">eterlab.</span>
                  </div>
                </Reveal>
              ) : null}

              <Reveal delay={0.1}>
                <h2
                  id="spotlight-title"
                  className={`${playfair.className} mt-8 text-balance text-[clamp(34px,4.2vw,56px)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-white`}
                >
                  {cs?.headline[lang] ?? work.title}
                </h2>
              </Reveal>
            </div>

            {/* live preview — plays on hover (or when centered on touch).
                The link is the hover target and never moves; only the inner
                frame lifts, so the pointer can't slip off its edge mid-lift. */}
            <Reveal delay={0.08} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <a
                ref={ref}
                {...bind}
                href={`/work/${work.slug}`}
                aria-label={`${c.spotlight.ctaCase}: ${work.title}`}
                className="group block rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0a0b] shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-[translate,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:border-white/20 group-hover:shadow-[0_36px_110px_rgba(0,0,0,0.6)]">
                  {/* browser chrome */}
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <div aria-hidden className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full border border-white/25" />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/25" />
                      <span className="h-2.5 w-2.5 rounded-full border border-white/25" />
                    </div>
                    <div className="mx-auto truncate rounded-full bg-white/[0.06] px-4 py-1 font-mono text-[11px] tracking-[0.08em] text-white/55">
                      {host}
                    </div>
                    <span aria-hidden className="w-[42px]" />
                  </div>

                  <div className="relative aspect-[16/10] w-full">
                    <ScrollPreview
                      video={work.preview}
                      poster={work.previewPoster ?? work.coverImage}
                      alt={work.title}
                      active={active}
                      hintTone="dark"
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-top"
                    />
                  </div>
                </div>
              </a>
            </Reveal>

            {/* details: lead + CTAs */}
            <div className="lg:self-start">
              <Reveal delay={0.12}>
                <p className="max-w-md text-pretty text-sm leading-relaxed text-white/65 sm:text-base">{c.spotlight.lead}</p>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`/work/${work.slug}`}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-ink transition-[translate] duration-200 hover:-translate-y-[1px]"
                  >
                    {c.spotlight.ctaCase}
                    <ArrowRight size={16} className="transition-[translate] duration-300 group-hover:translate-x-0.5" />
                  </a>
                  {work.liveUrl ? (
                    <a
                      href={work.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[15px] font-semibold text-white/85 transition-[translate,background-color,color] duration-200 hover:-translate-y-[1px] hover:bg-white/10 hover:text-white"
                    >
                      {c.spotlight.ctaLive}
                      <ArrowUpRight size={16} />
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
