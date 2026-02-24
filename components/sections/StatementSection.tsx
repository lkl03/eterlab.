"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

import { COPY, type Lang } from "../../lib/i18n";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";

type Props = {
  lang: Lang;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function highlightOpacity(progress: number, idx: number) {
  // progress is 0..1 across the section.
  // We want a “spotlight” moving across 4 lines.
  const lines = 4;
  const p = progress * lines; // 0..4
  const center = idx + 0.5;
  const dist = Math.abs(p - center);

  // dist 0 => 1, dist >= 1 => 0
  const t = 1 - clamp(dist, 0, 1);
  return 0.22 + 0.78 * t;
}

export default function StatementSection({ lang }: Props) {
  const c = COPY[lang];
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });

  const o0 = useTransform(scrollYProgress, (v) => highlightOpacity(v, 0));
  const o1 = useTransform(scrollYProgress, (v) => highlightOpacity(v, 1));
  const o2 = useTransform(scrollYProgress, (v) => highlightOpacity(v, 2));
  const o3 = useTransform(scrollYProgress, (v) => highlightOpacity(v, 3));

  const h0 = useTransform(o0, [0.22, 1], [0, 1]);
  const h1 = useTransform(o1, [0.22, 1], [0, 1]);
  const h2 = useTransform(o2, [0.22, 1], [0, 1]);
  const h3 = useTransform(o3, [0.22, 1], [0, 1]);

  // Left-side parallax phrases (only on the left, like Projects).
  // Move them further toward the center so they're readable while scrolling.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "22%"]);
  const bgX = useTransform(scrollYProgress, [0, 1], ["-14%", "42%"]);
  const leftPhrases = useMemo(() => {
    return lang === "es"
  ? ["claridad", "diseño", "velocidad", "calidad"]
  : ["clarity", "design", "speed", "quality"];
  }, [lang]);

  // Slightly more presence on the glow (requested), still soft / not harsh.
  const highlightClass =
    "absolute left-[-0.14em] right-[-0.14em] bottom-[0.10em] h-[0.64em] -z-10 rounded-full " +
    "bg-[linear-gradient(90deg,rgba(138,180,255,0.38),rgba(255,139,211,0.30))] blur-[18px]";

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-paper py-28 sm:py-32">
      {/* Left parallax phrases */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute left-[-6vw] top-[-8vw] hidden select-none md:block"
      >
        <div className="flex flex-col gap-6 text-[clamp(40px,5.2vw,96px)] font-semibold tracking-tight text-ink/[0.03]">
          {leftPhrases.map((t) => (
            <span key={t} className="leading-[0.86]">
              {t}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="grid gap-12 lg:grid-cols-[420px_1fr] lg:items-start">
          {/* left text */}
          <div>
            <Reveal>
              <SectionTag className="w-fit">{c.statement.tag}</SectionTag>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="mt-6 text-sm font-semibold text-ink">{c.statement.descStrong}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">{c.statement.desc}</p>
            </Reveal>
          </div>

          {/* right highlight lines */}
          <div className="lg:pl-8">
            <div
              className="text-right font-semibold tracking-tight text-ink"
              style={{ fontSize: "clamp(38px,5.2vw,84px)", lineHeight: "0.94em" }}
            >
              <motion.span style={{ opacity: o0 }} className="relative block sm:whitespace-nowrap">
                <motion.span aria-hidden style={{ opacity: h0 }} className={highlightClass} />
                {c.statement.lines[0]}
              </motion.span>

              <motion.span style={{ opacity: o1 }} className="relative block sm:whitespace-nowrap">
                <motion.span aria-hidden style={{ opacity: h1 }} className={highlightClass} />
                {c.statement.lines[1]}
              </motion.span>

              <motion.span style={{ opacity: o2 }} className="relative block sm:whitespace-nowrap">
                <motion.span aria-hidden style={{ opacity: h2 }} className={highlightClass} />
                {c.statement.lines[2]}
              </motion.span>

              <motion.span style={{ opacity: o3 }} className="relative block sm:whitespace-nowrap">
                <motion.span aria-hidden style={{ opacity: h3 }} className={highlightClass} />
                {c.statement.lines[3]}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

