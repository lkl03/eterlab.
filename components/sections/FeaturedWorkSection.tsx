"use client";

import { motion, useReducedMotion } from "framer-motion";

import { COPY, type Lang } from "../../lib/i18n";
import { LATEST_WORKS } from "../../lib/work";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";
import { WorkCard } from "../work/WorkCard";

type Props = {
  lang: Lang;
};

/**
 * "latest work": every recent client project at once, as a bento grid.
 * The newest one leads across two columns; the rest fill a 3-up row
 * (2-up on tablet, stacked on phones). Previews play on hover.
 */
export default function FeaturedWorkSection({ lang }: Props) {
  const c = COPY[lang];
  const reduceMotion = useReducedMotion();

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

          {/* Only pointer devices get the hint — touch plays cards as they scroll by. */}
          <Reveal delay={0.12}>
            <p className="mt-3 hidden text-xs font-medium text-ink/40 pointer-fine:block">{c.featured.hoverHint}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {LATEST_WORKS.map((work, i) => (
            <WorkCard key={work.slug} work={work} lang={lang} featured={i === 0} index={i} />
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button variant="light" href="/work" ariaLabel={c.featured.viewAll} className="w-full sm:w-auto">
            {c.featured.viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
