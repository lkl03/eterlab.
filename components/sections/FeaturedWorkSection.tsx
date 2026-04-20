"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { COPY, type Lang } from "../../lib/i18n";
import { FEATURED_SLIDESHOW_WORKS, type Work } from "../../lib/work";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";

type Props = {
  lang: Lang;
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const AUTOPLAY_MS = 6500;

export default function FeaturedWorkSection({ lang }: Props) {
  const c = COPY[lang];
  const reduceMotion = useReducedMotion();

  // Works shown as large hero slides (desktop slideshow).
  const slides = useMemo<Work[]>(() => FEATURED_SLIDESHOW_WORKS, []);
  const hasMultiple = slides.length > 1;

  // Mobile shows up to 3 tiles stacked, then a "view all" CTA.
  const mobileCards = useMemo<Work[]>(() => slides.slice(0, 3), [slides]);

  // Slideshow state.
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number, dir: 1 | -1 = 1) => {
      if (slides.length === 0) return;
      const normalized = ((next % slides.length) + slides.length) % slides.length;
      setDirection(dir);
      setIndex(normalized);
    },
    [slides.length]
  );

  const goNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Autoplay (paused on hover/focus and when reduced-motion is requested).
  useEffect(() => {
    if (reduceMotion || paused || !hasMultiple) return;
    autoplayRef.current = window.setTimeout(() => {
      goTo(index + 1, 1);
    }, AUTOPLAY_MS);
    return () => {
      if (autoplayRef.current) window.clearTimeout(autoplayRef.current);
    };
  }, [index, paused, reduceMotion, hasMultiple, goTo]);

  // Keyboard navigation when the slideshow is focused.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  const currentWork = slides[index] ?? slides[0];
  const currentCoverSrc =
    currentWork?.coverByLang?.[lang] ??
    currentWork?.coverImage ??
    "/work/bioprotece3d-cover.svg";

  return (
    <section id="work" className="relative overflow-hidden bg-paper py-28 sm:py-32">
      {/* moving background (match VenceHero vibe) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 eter-gradient-bg" />

      {/* organic blob (adds a second layer of motion) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="h-[520px] w-[520px] rounded-full blur-[70px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(138,180,255,0.20), transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,139,211,0.16), transparent 62%), radial-gradient(circle at 50% 80%, rgba(164,148,255,0.12), transparent 64%)",
            opacity: 0.8,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 26, -18, 0],
                  y: [0, -22, 16, 0],
                  rotate: [0, 10, -8, 0],
                  borderRadius: [
                    "42% 58% 46% 54% / 54% 42% 58% 46%",
                    "58% 42% 60% 40% / 46% 58% 42% 54%",
                    "46% 54% 42% 58% / 60% 40% 58% 42%",
                    "42% 58% 46% 54% / 54% 42% 58% 46%",
                  ],
                }
          }
          transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <SectionTag className="mx-auto w-fit">{c.featured.tag}</SectionTag>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="eter-title mt-6 text-balance font-semibold tracking-tight text-ink">{c.featured.title}</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ink/60 sm:text-base">{c.featured.desc}</p>
          </Reveal>
        </div>

        {/* =========================================================
            DESKTOP / TABLET (≥ sm): large hero slideshow.
            Each slide keeps the original hero proportions.
           ========================================================= */}
        <div
          className="mx-auto mt-14 hidden max-w-5xl sm:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={hasMultiple ? 0 : -1}
          onKeyDown={onKeyDown}
          role={hasMultiple ? "region" : undefined}
          aria-roledescription={hasMultiple ? "carousel" : undefined}
          aria-label={hasMultiple ? c.featured.title : undefined}
        >
          {/* Slideshow stage — fixed aspect + absolutely-positioned slides
              so transitions don't collapse layout. */}
          <div className="relative">
            <div className="relative aspect-[16/9] w-full">
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                  key={currentWork.slug || `slide-${index}`}
                  custom={direction}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction === 1 ? 60 : -60, scale: 0.995 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction === 1 ? -60 : 60, scale: 0.995 }
                  }
                  transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: EASE }}
                  className="absolute inset-0"
                >
                  <a
                    href={`/work/${currentWork.slug}`}
                    aria-label={c.featured.ctaMore}
                    className="block h-full w-full overflow-hidden rounded-t-[30px] border border-b-0 border-ink/10 bg-white/60 shadow-[0_18px_90px_rgba(17,17,26,0.10)] backdrop-blur"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={currentCoverSrc}
                        alt={currentWork.title}
                        fill
                        sizes="(min-width: 1024px) 1024px, 100vw"
                        priority={index === 0}
                        className="object-cover transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.01] group-hover:saturate-[1.05]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.10))]"
                      />
                    </div>
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* Prev / next arrows */}
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous slide"
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 shadow-[0_8px_24px_rgba(17,17,26,0.10)] backdrop-blur transition hover:text-ink"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next slide"
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 shadow-[0_8px_24px_rgba(17,17,26,0.10)] backdrop-blur transition hover:text-ink"
                  >
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Meta block under the cover (also animated with the slide). */}
            <div className="relative">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={`meta-${currentWork.slug || index}`}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: EASE }}
                  className="overflow-hidden rounded-b-[30px] border border-t-0 border-ink/10 bg-white/70 p-7 shadow-[0_18px_90px_rgba(17,17,26,0.10)] backdrop-blur sm:p-9"
                >
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                        {currentWork.badge[lang]}
                      </div>
                      <h3 className="eter-bubble-title mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                        {currentWork.title}
                      </h3>
                    </div>
                    <div className="text-xs font-medium text-ink/40">{currentWork.year}</div>
                  </div>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/60 sm:text-base">
                    {currentWork.summary[lang]}
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:items-end">
                    {currentWork.liveUrl ? (
                      <Button variant="dark" href={currentWork.liveUrl} ariaLabel="Visit site" className="w-full sm:w-auto">
                        {c.featured.ctaLive}
                      </Button>
                    ) : null}

                    <Button variant="light" href={`/work/${currentWork.slug}`} ariaLabel="Learn more" className="w-full sm:w-auto">
                      {c.featured.ctaMore}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots */}
          {hasMultiple && (
            <div className="mt-7 flex items-center justify-center gap-2.5" role="tablist" aria-label="Slide indicators">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={s.slug || `dot-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    className={
                      "h-1.5 rounded-full transition-all duration-300 " +
                      (active ? "w-8 bg-ink/80" : "w-2.5 bg-ink/25 hover:bg-ink/45")
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* =========================================================
            MOBILE (< sm): up to 3 cards stacked + "ver todos" CTA.
           ========================================================= */}
        <div className="mt-12 grid gap-5 sm:hidden">
          {mobileCards.map((w, i) => {
            const coverSrc = w.coverByLang?.[lang] ?? w.coverImage ?? "/work/bioprotece3d-cover.svg";
            return (
              <motion.a
                key={w.slug || `m-${i}`}
                href={`/work/${w.slug}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.05 }}
                className="group overflow-hidden rounded-[26px] border border-ink/10 bg-white/70 shadow-[0_14px_60px_rgba(17,17,26,0.08)] backdrop-blur"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={coverSrc}
                    alt={w.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.02]"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
                      {w.badge[lang]}
                    </div>
                    <div className="text-[11px] font-medium text-ink/40">{w.year}</div>
                  </div>
                  <div className="mt-2 text-lg font-semibold tracking-tight text-ink">{w.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-ink/55">{w.summary[lang]}</div>
                </div>
              </motion.a>
            );
          })}

          <div className="mt-3 flex justify-center">
            <Button variant="light" href="/work" ariaLabel="View all work" className="w-full">
              {c.featured.viewAll}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
