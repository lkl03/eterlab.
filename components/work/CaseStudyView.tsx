"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { COPY, type Lang } from "../../lib/i18n";
import { playfair } from "../../lib/fonts";
import { getNextWork, type CaseChapter, type CaseStudy, type Work, type WorkMedia } from "../../lib/work";
import { useHoverPreview } from "../../hooks/useHoverPreview";
import { Reveal } from "../ui/Reveal";
import { ScrollPreview } from "../ui/ScrollPreview";

type Props = {
  work: Work;
  cs: CaseStudy;
  lang: Lang;
};

type Tone = ReturnType<typeof tones>;

/** Colour tokens per theme, so every block below stays theme-agnostic. */
function tones(dark: boolean) {
  return dark
    ? {
        text: "text-white",
        muted: "text-white/65",
        faint: "text-white/45",
        line: "border-white/10",
        panel: "bg-[#0a0a0b]",
        chip: "border-white/15 bg-white/[0.05] text-white/70",
        dot: "border-white/25",
        frame: "shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
        ghost: "border-white/20 text-white/85 hover:bg-white/10 hover:text-white",
        primary: "bg-white text-ink",
      }
    : {
        text: "text-ink",
        muted: "text-ink/60",
        faint: "text-ink/45",
        line: "border-ink/10",
        panel: "bg-white",
        chip: "border-ink/10 bg-white text-ink/70",
        dot: "border-ink/20",
        frame: "shadow-[0_18px_70px_rgba(17,17,26,0.10)]",
        ghost: "border-ink/15 bg-white text-ink/80 hover:text-ink",
        primary: "bg-ink text-white",
      };
}

function hostOf(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Chaptered, long-form case study (JINETES, Bioprotece…). */
export default function CaseStudyView({ work, cs, lang }: Props) {
  const c = COPY[lang];
  const dark = cs.theme === "dark";
  const t = tones(dark);
  const display =
    cs.displayFont === "playfair"
      ? `${playfair.className} font-extrabold uppercase tracking-[-0.01em]`
      : "font-semibold tracking-tight";
  const next = getNextWork(work.slug);
  const host = hostOf(work.liveUrl);

  return (
    <article className={t.text}>
      {/* ——— header ——— */}
      <header className="mx-auto w-[min(1120px,calc(100%-2rem))] pt-6 sm:pt-10">
        <nav className="flex flex-wrap items-center gap-2" aria-label="breadcrumb">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${t.ghost}`}
          >
            <ArrowLeft size={15} />
            {c.nav.home}
          </Link>
          <Link
            href="/work"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${t.ghost}`}
          >
            {c.caseStudy.allWork}
          </Link>
        </nav>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <Reveal>
              <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${t.faint}`}>{cs.kicker[lang]}</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className={`${display} mt-5 text-balance text-[clamp(40px,6.4vw,88px)] leading-[0.95]`}>
                {cs.headline[lang]}
              </h1>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.08}>
              <Lockup cs={cs} dark={dark} />
            </Reveal>
            <Reveal delay={0.1}>
              <p className={`mt-6 max-w-md text-pretty text-sm leading-relaxed sm:text-base ${t.muted}`}>{cs.intro[lang]}</p>
            </Reveal>
            {work.liveUrl ? (
              <Reveal delay={0.12}>
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-[1px] ${t.primary}`}
                >
                  {c.featured.ctaLive}
                  <ArrowUpRight size={16} />
                </a>
              </Reveal>
            ) : null}
          </div>
        </div>

        <Reveal delay={0.1}>
          <HeroPreview work={work} t={t} dark={dark} host={host} hint={c.caseStudy.hoverHint} />
        </Reveal>

        {/* facts */}
        <Reveal delay={0.05}>
          <dl className={`mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-8 sm:grid-cols-4 ${t.line}`}>
            <Fact label={c.caseStudy.client} t={t}>
              {work.title}
            </Fact>
            <Fact label={c.caseStudy.year} t={t}>
              {work.year}
            </Fact>
            <Fact label={c.caseStudy.services} t={t}>
              {work.role[lang]}
            </Fact>
            {work.liveUrl ? (
              <Fact label={c.caseStudy.site} t={t}>
                <a href={work.liveUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  {host}
                </a>
              </Fact>
            ) : null}
          </dl>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={c.caseStudy.stack}>
            {work.stack.map((s) => (
              <li key={s} className={`rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.06em] ${t.chip}`}>
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      {/* ——— chapters ——— */}
      <div className="mx-auto mt-20 w-[min(1120px,calc(100%-2rem))] sm:mt-28">
        {cs.chapters.map((ch, i) => (
          <Chapter key={ch.title.en} ch={ch} n={i + 1} lang={lang} t={t} dark={dark} display={display} />
        ))}
      </div>

      {/* ——— closing ——— */}
      <section className={`mx-auto mt-8 w-[min(1120px,calc(100%-2rem))] border-t py-24 text-center sm:py-32 ${t.line}`}>
        <Reveal>
          <Lockup cs={cs} dark={dark} stacked />
        </Reveal>
        <Reveal delay={0.06}>
          <p className={`${display} mx-auto mt-10 max-w-3xl text-balance text-[clamp(28px,3.8vw,48px)] leading-[1.02]`}>
            {cs.closing[lang]}
          </p>
        </Reveal>
        {cs.thanks ? (
          <Reveal delay={0.08}>
            <p className={`mt-6 text-sm ${t.muted}`}>{cs.thanks[lang]}</p>
          </Reveal>
        ) : null}
        {work.liveUrl ? (
          <Reveal delay={0.1}>
            <a
              href={work.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-8 inline-flex items-center gap-2 border-t pt-6 font-mono text-sm tracking-[0.08em] underline-offset-4 hover:underline ${t.line} ${t.text}`}
            >
              {host}
              <ArrowUpRight size={14} />
            </a>
          </Reveal>
        ) : null}
      </section>

      {/* ——— next steps ——— */}
      <section className="mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-5 pb-24 md:grid-cols-2">
        <div className={`flex flex-col justify-between rounded-[26px] border p-7 sm:p-9 ${t.line} ${t.panel}`}>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{c.caseStudy.ctaTitle}</h2>
            <p className={`mt-3 text-sm leading-relaxed ${t.muted}`}>{c.caseStudy.ctaBody}</p>
          </div>
          <Link
            href="/#contact"
            className={`mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-[1px] ${t.primary}`}
          >
            {c.caseStudy.ctaButton}
            <ArrowRight size={16} />
          </Link>
        </div>

        {next ? <NextCard next={next} lang={lang} t={t} label={c.caseStudy.next} /> : null}
      </section>
    </article>
  );
}

function Lockup({ cs, dark, stacked = false }: { cs: CaseStudy; dark: boolean; stacked?: boolean }) {
  const logoH = cs.partnerLogo.height / cs.partnerLogo.width > 0.6 ? (stacked ? "h-28 sm:h-32" : "h-16 sm:h-20") : stacked ? "h-12 sm:h-14" : "h-9 sm:h-11";
  return (
    <div className={stacked ? "flex flex-col items-center gap-4" : "flex flex-wrap items-center gap-4"}>
      <Image
        src={cs.partnerLogo.src}
        alt={cs.partnerLogo.alt}
        width={cs.partnerLogo.width}
        height={cs.partnerLogo.height}
        className={`w-auto ${logoH}`}
      />
      <span aria-hidden className={dark ? "text-white/40" : "text-ink/35"}>
        ×
      </span>
      <span className={`font-logo leading-none tracking-tight ${stacked ? "text-5xl sm:text-6xl" : "text-4xl sm:text-[44px]"}`}>
        eterlab.
      </span>
    </div>
  );
}

function HeroPreview({ work, t, dark, host, hint }: { work: Work; t: Tone; dark: boolean; host: string; hint: string }) {
  const { ref, bind, active } = useHoverPreview<HTMLDivElement>();
  if (!work.preview && !work.previewPoster) return null;

  return (
    <div
      ref={ref}
      {...bind}
      tabIndex={0}
      aria-label={hint}
      className={`group mt-14 overflow-hidden rounded-[24px] border outline-none focus-visible:ring-2 focus-visible:ring-current ${t.line} ${t.panel} ${t.frame}`}
    >
      <BrowserBar t={t} label={host} />
      <div className="relative aspect-[16/10] w-full">
        <ScrollPreview
          video={work.preview}
          poster={work.previewPoster ?? work.coverImage}
          alt={work.title}
          active={active}
          priority
          hintTone={dark ? "dark" : "light"}
          sizes="(min-width: 1120px) 1120px, 100vw"
          className="object-top"
        />
      </div>
    </div>
  );
}

function BrowserBar({ t, label }: { t: Tone; label?: string }) {
  return (
    <div className={`flex items-center gap-3 border-b px-4 py-2.5 ${t.line}`}>
      <div aria-hidden className="flex gap-1.5">
        <span className={`h-2.5 w-2.5 rounded-full border ${t.dot}`} />
        <span className={`h-2.5 w-2.5 rounded-full border ${t.dot}`} />
        <span className={`h-2.5 w-2.5 rounded-full border ${t.dot}`} />
      </div>
      {label ? <div className={`mx-auto truncate font-mono text-[11px] tracking-[0.08em] ${t.faint}`}>{label}</div> : null}
      {label ? <span aria-hidden className="w-[42px]" /> : null}
    </div>
  );
}

function Fact({ label, t, children }: { label: string; t: Tone; children: ReactNode }) {
  return (
    <div>
      <dt className={`font-mono text-[11px] uppercase tracking-[0.18em] ${t.faint}`}>{label}</dt>
      <dd className="mt-2 text-sm font-semibold">{children}</dd>
    </div>
  );
}

function Chapter({
  ch,
  n,
  lang,
  t,
  dark,
  display,
}: {
  ch: CaseChapter;
  n: number;
  lang: Lang;
  t: Tone;
  dark: boolean;
  display: string;
}) {
  const c = COPY[lang];
  const desktop = ch.media?.filter((m) => m.kind === "desktop") ?? [];
  const mobile = ch.media?.filter((m) => m.kind === "mobile") ?? [];

  return (
    <section className={`border-t py-16 sm:py-24 ${t.line}`}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal>
            <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${t.faint}`}>
              <span className={t.text}>{String(n).padStart(2, "0")}</span> — {ch.kicker[lang]}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className={`${display} mt-5 text-balance text-[clamp(32px,4.4vw,60px)] leading-[0.98]`}>{ch.title[lang]}</h2>
          </Reveal>
        </div>

        <div className="lg:pt-9">
          <Reveal delay={0.08}>
            <p className={`max-w-xl text-pretty text-base leading-relaxed sm:text-lg ${t.muted}`}>{ch.body[lang]}</p>
          </Reveal>

          {ch.stats?.length ? (
            <Reveal delay={0.1}>
              <dl className={`mt-10 grid gap-6 ${ch.stats.length > 2 ? "grid-cols-3" : "w-fit grid-cols-2 gap-x-12"}`}>
                {ch.stats.map((s) => (
                  <div key={s.label.en}>
                    <dt className="sr-only">{s.label[lang]}</dt>
                    <dd className={`${display} text-[clamp(40px,5vw,60px)] leading-none`}>{s.value}</dd>
                    <dd className={`mt-2 font-mono text-[11px] uppercase tracking-[0.18em] ${t.faint}`}>{s.label[lang]}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {ch.features?.length ? (
            <Reveal delay={0.1}>
              <dl className={`mt-10 border-t ${t.line}`}>
                {ch.features.map((f) => (
                  <div key={f.label.en} className={`grid gap-1 border-b py-4 sm:grid-cols-[150px_1fr] sm:gap-6 ${t.line}`}>
                    <dt className={`font-mono text-[11px] uppercase tracking-[0.18em] sm:pt-1 ${t.faint}`}>{f.label[lang]}</dt>
                    <dd className={`text-sm leading-relaxed sm:text-base ${t.muted}`}>{f.text[lang]}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </div>

      {desktop.length ? (
        <div className={`mt-12 grid gap-6 sm:mt-16 ${desktop.length > 1 ? "md:grid-cols-2" : ""}`}>
          {desktop.map((m, i) => (
            <Reveal key={m.src} delay={i * 0.06}>
              <DesktopShot m={m} lang={lang} t={t} sizes={desktop.length > 1 ? "(min-width: 768px) 560px, 100vw" : "(min-width: 1120px) 1120px, 100vw"} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {mobile.length ? (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 md:grid-cols-4">
          {mobile.map((m, i) => (
            <Reveal key={m.src} delay={i * 0.06} className={i % 2 === 1 ? "md:translate-y-10" : ""}>
              <PhoneShot m={m} lang={lang} dark={dark} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {ch.pairs?.length ? (
        <div className="mt-12 grid gap-10 sm:mt-16">
          {ch.pairs.map((p) => (
            <div key={p.after.src} className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-5">
              <Reveal>
                <DesktopShot m={p.before} lang={lang} t={t} badge={c.caseStudy.before} muted sizes="(min-width: 768px) 520px, 100vw" />
              </Reveal>
              <ArrowRight aria-hidden className={`mx-auto rotate-90 md:rotate-0 ${t.faint}`} size={20} />
              <Reveal delay={0.06}>
                <DesktopShot m={p.after} lang={lang} t={t} badge={c.caseStudy.after} sizes="(min-width: 768px) 520px, 100vw" />
              </Reveal>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function DesktopShot({
  m,
  lang,
  t,
  sizes,
  badge,
  muted = false,
}: {
  m: WorkMedia;
  lang: Lang;
  t: Tone;
  sizes: string;
  badge?: string;
  muted?: boolean;
}) {
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-[18px] border ${t.line} ${t.panel} ${t.frame}`}>
        <BrowserBar t={t} />
        {badge ? (
          <span className={`absolute right-3 top-2 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${t.chip}`}>
            {badge}
          </span>
        ) : null}
        <Image
          src={m.src}
          alt={m.alt[lang]}
          width={m.width}
          height={m.height}
          sizes={sizes}
          className={`block h-auto w-full ${muted ? "opacity-80 grayscale-[35%]" : ""}`}
        />
      </div>
      {m.caption ? (
        <figcaption className={`mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] ${t.faint}`}>
          {m.caption[lang]}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PhoneShot({ m, lang, dark }: { m: WorkMedia; lang: Lang; dark: boolean }) {
  return (
    <figure
      className={`overflow-hidden rounded-[26px] border-[5px] sm:rounded-[32px] sm:border-[6px] ${
        dark ? "border-[#2a2a2c] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]" : "border-ink/85 bg-ink shadow-[0_18px_60px_rgba(17,17,26,0.18)]"
      }`}
    >
      <Image src={m.src} alt={m.alt[lang]} width={m.width} height={m.height} sizes="(min-width: 768px) 260px, 45vw" className="block h-auto w-full" />
    </figure>
  );
}

function NextCard({ next, lang, t, label }: { next: Work; lang: Lang; t: Tone; label: string }) {
  const { ref, bind, active } = useHoverPreview<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      {...bind}
      href={`/work/${next.slug}`}
      className={`group flex flex-col overflow-hidden rounded-[26px] border outline-none focus-visible:ring-2 focus-visible:ring-current ${t.line} ${t.panel}`}
    >
      <div className={`relative aspect-[16/8] w-full overflow-hidden border-b ${t.line}`}>
        <ScrollPreview
          video={next.preview}
          poster={next.previewPoster ?? next.coverImage}
          alt=""
          active={active}
          showHint={false}
          sizes="(min-width: 768px) 560px, 100vw"
          className="object-top"
        />
      </div>
      <div className="p-7 sm:p-8">
        <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${t.faint}`}>{label}</div>
        <div className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {next.title}
          <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
        <p className={`mt-2 line-clamp-2 max-w-md text-sm ${t.muted}`}>{next.summary[lang]}</p>
      </div>
    </Link>
  );
}
