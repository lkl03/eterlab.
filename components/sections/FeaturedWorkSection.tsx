"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { COPY, type Lang } from "../../lib/i18n";
import { LATEST_WORK, WORKS } from "../../lib/work";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";

type Props = {
  lang: Lang;
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function FeaturedWorkSection({ lang }: Props) {
  const c = COPY[lang];
  const work = LATEST_WORK;
  const reduceMotion = useReducedMotion();

  // Local handle (requested): controls whether the extra tiles + toggle button render.
  // Keep this flag ONLY here.
  const ENABLE_MORE_TILES = false;

  const more = useMemo(() => WORKS.filter((w) => w.slug !== work.slug).slice(0, 3), [work.slug]);
  const hasMoreTiles = more.length > 0;

  // Local toggle for the extra tiles (only rendered when ENABLE_MORE_TILES is enabled).
  const [showMore, setShowMore] = useState(false);

  const coverSrc = work.coverByLang?.[lang] ?? work.coverImage ?? "../../public/work/eterlab-cover.svg";

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

        {/* featured project (single component: image + content attached) */}
        <div className="mx-auto mt-14 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{ duration: 0.85, ease: EASE }}
            className="group overflow-hidden rounded-[30px] border border-ink/10 bg-white/60 shadow-[0_18px_90px_rgba(17,17,26,0.10)] backdrop-blur"
          >
            <a href={`/work/${work.slug}`} aria-label={c.featured.ctaMore} className="block">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={coverSrc}
                  alt={work.title}
                  fill
                  placeholder="blur"
                  blurDataURL="../../public/work/bioprotece3d-cover.svg"
                  className="object-cover transition duration-300 ease-in-out group-hover:scale-[1.01] group-hover:saturate-[1.05]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.10))]"
                />
              </div>
            </a>

            <div className="border-t border-ink/10 bg-white/70 p-7 backdrop-blur sm:p-9">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{work.badge[lang]}</div>
                  <h3 className="eter-bubble-title mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{work.title}</h3>
                </div>
                <div className="text-xs font-medium text-ink/40">{work.year}</div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/60 sm:text-base">{work.summary[lang]}</p>

              {/* requested: stack buttons vertically (not aligned side-by-side) */}
              <div className="mt-7 flex flex-col gap-3 sm:items-end">
                {work.liveUrl ? (
                  <Button variant="dark" href={work.liveUrl} ariaLabel="Visit site" className="w-full sm:w-auto">
                    {c.featured.ctaLive}
                  </Button>
                ) : null}

                <Button variant="light" href={`/work/${work.slug}`} ariaLabel="Learn more" className="w-full sm:w-auto">
                  {c.featured.ctaMore}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* more tiles (toggled by View all) */}
        {ENABLE_MORE_TILES && hasMoreTiles && showMore && (
          <div className="mt-16">
            <Reveal>
              <h3 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">{c.featured.moreTitle}</h3>
            </Reveal>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((w) => (
                <motion.a
                  key={w.slug}
                  href={`/work/${w.slug}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
                  transition={{ duration: 0.75, ease: EASE }}
                  className="group overflow-hidden rounded-[26px] border border-ink/10 bg-white/70 shadow-[0_14px_60px_rgba(17,17,26,0.08)] backdrop-blur transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] hover:-translate-y-[2px]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={w.coverImage}
                      alt={w.title}
                      fill
                      className="object-cover transition duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{w.badge[lang]}</div>
                    <div className="mt-2 text-base font-semibold tracking-tight text-ink">{w.title}</div>
                    <div className="mt-2 text-sm text-ink/55">{w.summary[lang]}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* view all (toggle)
            Requested: hide this button whenever SHOW_MORE_TILES is false (same visibility as tiles). */}
        {ENABLE_MORE_TILES && hasMoreTiles && (
          <div className="mt-12 flex justify-center">
            {!showMore ? (
              <Button variant="light" onClick={() => setShowMore(true)} ariaLabel="View all">
                {c.featured.viewAll}
              </Button>
            ) : (
              <Button variant="light" onClick={() => setShowMore(false)} ariaLabel="Show less">
                {c.featured.viewLess}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


