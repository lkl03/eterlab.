"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { COPY, type Lang } from "../../lib/i18n";
import type { Work } from "../../lib/work";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import { ScrollPreview } from "../ui/ScrollPreview";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

type Props = {
  work: Work;
  lang: Lang;
  /** Lead card: spans two columns and lets its cover grow to the row height. */
  featured?: boolean;
  index?: number;
};

/**
 * Grid card for a client case study. The whole card links to /work/[slug]
 * (stretched title link); "visit site" sits above it as its own link.
 */
export function WorkCard({ work, lang, featured = false, index = 0 }: Props) {
  const c = COPY[lang];
  const { ref, bind, active } = useHoverPreview<HTMLLIElement>();
  const poster = work.previewPoster ?? work.coverByLang?.[lang] ?? work.coverImage;

  return (
    <motion.li
      ref={ref}
      {...bind}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 3) * 0.07 }}
      // The <li> is the hover target and never moves; only the card inside
      // lifts, so the pointer can't slip off the bottom edge mid-animation.
      className={"group flex " + (featured ? "sm:col-span-2" : "")}
    >
      <div
        className={
          "relative flex w-full flex-col overflow-hidden rounded-[26px] border border-ink/10 bg-white/80 shadow-[0_10px_40px_rgba(17,17,26,0.06)] backdrop-blur " +
          "transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_18px_70px_rgba(17,17,26,0.12)] " +
          "group-focus-within:ring-2 group-focus-within:ring-ink/15"
        }
      >
        <div
          className={
            "relative w-full overflow-hidden border-b border-ink/10 bg-paperMuted " +
            (featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[260px] lg:flex-1" : "aspect-[16/10]")
          }
        >
          <ScrollPreview
            video={work.preview}
            poster={poster}
            alt={work.title}
            active={active}
            sizes={featured ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-top"
          />
        </div>

        <div className="flex flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">{work.badge[lang]}</span>
            <span className="text-[11px] font-medium text-ink/40">{work.year}</span>
          </div>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            <a
              href={`/work/${work.slug}`}
              className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
            >
              {work.title}
            </a>
          </h3>

          <p className={"mt-2.5 text-sm leading-relaxed text-ink/60 " + (featured ? "line-clamp-2" : "line-clamp-3")}>
            {work.summary[lang]}
          </p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              {c.featured.ctaMore}
              <ArrowRight
                size={15}
                className="transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              />
            </span>

            {work.liveUrl ? (
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="relative z-[2] inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors duration-200 hover:border-ink/20 hover:text-ink"
              >
                {c.featured.ctaLive}
                <ArrowUpRight size={13} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
