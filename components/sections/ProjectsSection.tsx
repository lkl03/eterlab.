"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

import { COPY, type Lang } from "../../lib/i18n";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";

type Props = {
  lang: Lang;
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Local handle: toggle the “coming soon” styling for Moonlight.
// Set to false when the project is launched.
const MOONLIGHT_COMING_SOON = true;

export default function ProjectsSection({ lang }: Props) {
  const c = COPY[lang];
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax words should "enter" further toward the center while scrolling.
  const leftY = useTransform(scrollYProgress, [0, 1], ["-12%", "18%"]);
  const leftX = useTransform(scrollYProgress, [0, 1], ["-14%", "66%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["12%", "-18%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["14%", "-66%"]);

  // Parallax words: language-aware + more subtle opacity.
  const leftWords = useMemo(() => {
    return lang === "es"
      ? ["clientes", "performance", "claridad", "sistemas", "entrega"]
      : ["clients", "systems", "studio", "motion", "clarity"];
  }, [lang]);

  const rightWords = useMemo(() => {
    return lang === "es"
      ? ["diseño", "desarrollo", "producto", "web", "interfaces"]
    : ["design", "development", "product", "web", "interfaces"];
  }, [lang]);

const prompteaCoverByLang: Record<Lang, string> = {
  es: "/work/promptea-cover-es.jpg",
  en: "/work/promptea-cover-en.jpg",
};

const cards = useMemo(
  () => [
    {
      key: "promptea",
      title: "promptea.me",
      badge: c.projects.cards.promptea.badge,
      desc: c.projects.cards.promptea.desc,
      image: prompteaCoverByLang[lang],
      url: "https://promptea.me",
      comingSoon: false,
    },
    {
      key: "moonlight",
      title: "moonlight web designs",
      badge: c.projects.cards.moonlight.badge,
      desc: c.projects.cards.moonlight.desc,
      image: "/work/moonlight-cover.jpg",
      url: "https://moonlightwebdesigns.com/",
      comingSoon: false, // Set to MOONLIGHT_COMING_SOON when the project is launched.
    },
  ],
  [c, lang]
);

  return (
    <section id="projects" ref={ref} className="relative overflow-hidden bg-paper py-28 sm:py-32">
      {/* Subtle parallax words (background identity) */}
      <motion.div
        aria-hidden
        style={{ x: leftX, y: leftY }}
        className="pointer-events-none absolute left-[-6vw] top-[-6vw] hidden select-none md:block"
      >
        <div className="flex flex-col gap-6 text-[clamp(44px,5.6vw,104px)] font-semibold tracking-tight text-ink/[0.03]">
          {leftWords.map((w) => (
            <span key={w} className="leading-[0.86]">
              {w}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        style={{ x: rightX, y: rightY }}
        className="pointer-events-none absolute right-[-6vw] top-[10vw] hidden select-none md:block"
      >
        <div className="flex flex-col items-end gap-6 text-[clamp(44px,5.6vw,104px)] font-semibold tracking-tight text-ink/[0.03]">
          {rightWords.map((w) => (
            <span key={w} className="leading-[0.86]">
              {w}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))]">
        {/* header */}
        <div className="grid gap-8 lg:grid-cols-[160px_1fr_360px] lg:items-center">
          <Reveal>
            <SectionTag className="w-fit">{c.projects.tag}</SectionTag>
          </Reveal>

          <div className="min-w-0">
            <Reveal delay={0.05}>
              <h2 className="eter-title text-balance font-semibold tracking-tight text-ink">{c.projects.title}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-3 text-sm font-semibold text-ink/55">
                {c.projects.meta}
                {year}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-ink/60 lg:justify-self-end lg:text-right">
              {c.projects.kicker}
            </p>
          </Reveal>
        </div>

        {/* cards */}
        <div className="mt-14 grid gap-10">
          {cards.map((card, idx) => (
            <motion.article
              key={card.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
              transition={{ duration: 0.85, ease: EASE, delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(17,17,26,0.06)] transition-shadow duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] hover:shadow-[0_16px_70px_rgba(17,17,26,0.10)]"
            >
              {/* Coming soon overlay (Moonlight) */}
              {card.comingSoon ? (
                <div
                  className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-paper/70 backdrop-blur-[2px]"
                  aria-hidden
                >
                  <div className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60 shadow-[0_14px_60px_rgba(17,17,26,0.10)]">
                    {c.projects.cards.moonlight.overlay}
                  </div>
                </div>
              ) : null}

              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                {/* image side */}
                <div className="relative overflow-hidden">
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={card.image} alt={card.title} fill priority={false} className="object-cover" />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.10))]"
                    />
                  </div>
                </div>

                {/* content side */}
                <div className="relative flex flex-col justify-center p-7 sm:p-9">
                  <div className={card.comingSoon ? "relative opacity-70" : "relative"}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-semibold text-ink/70 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/25" />
                      {card.badge}
                    </div>

                    <h3 className="eter-bubble-title mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">{card.desc}</p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Button
                        variant="dark"
                        href={card.comingSoon ? undefined : card.url}
                        disabled={card.comingSoon}
                        ariaLabel="Visit site"
                      >
                        {card.key === "moonlight"
                          ? c.projects.cards.moonlight.ctaSecondary
                          : c.projects.cards.promptea.ctaSecondary}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

