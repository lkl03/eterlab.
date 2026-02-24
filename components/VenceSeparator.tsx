import { Lang, COPY } from "@/lib/i18n";

export default function VenceSeparator({ lang }: { lang: Lang }) {
  return (
    <section
      aria-label="Separator"
      className="relative flex h-[50svh] items-center justify-center overflow-hidden"
    >
      {/* Fondo etéreo (sin negro, sin colores fuertes) */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,#f1f1f1_0%,#ffffff_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(33,33,33,0.06),transparent_45%,rgba(33,33,33,0.05))]" />

      <div className="relative px-6 text-center">
        <p className="text-base sm:text-lg wide:text-xl text-ink/70">
          {COPY[lang].separator.line}
        </p>

        <h2 className="mt-4 font-title text-6xl font-semibold tracking-tight sm:text-7xl wide:text-8xl">
          {COPY[lang].separator.big}
        </h2>
      </div>
    </section>
  );
}
