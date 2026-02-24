"use client";

import Image from "next/image";

import { COPY, type Lang } from "../../lib/i18n";
import { WORKS } from "../../lib/work";

import { Button } from "../../components/ui/Button";

export default function WorkTiles({ lang }: { lang: Lang }) {
  const c = COPY[lang];

  // Exclude the featured item (but keep safe if only one)
  const tiles = WORKS.slice(1);
  if (tiles.length === 0) return null;

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((w) => (
        <article
          key={w.slug}
          className="group relative overflow-hidden rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_10px_40px_rgba(17,17,26,0.06)] transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] hover:-translate-y-[2px] hover:shadow-[0_16px_70px_rgba(17,17,26,0.10)]"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-ink">
            <span className="opacity-70">●</span>
            <span>{w.badge[lang]}</span>
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">{w.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{w.summary[lang]}</p>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="dark" href={`/work/${w.slug}`} ariaLabel={c.workIndex.open}>
              {c.workIndex.open}
            </Button>
            {w.liveUrl && (
              <Button variant="light" href={w.liveUrl} ariaLabel={c.workIndex.live}>
                {c.workIndex.live}
              </Button>
            )}
          </div>

          <div className="mt-6 relative h-[120px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-paper-muted">
            <Image src={w.coverImage} alt={w.title} fill className="object-cover" />
          </div>
        </article>
      ))}
    </div>
  );
}
