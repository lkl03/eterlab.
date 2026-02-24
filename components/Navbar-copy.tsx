"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import type { Lang } from "../lib/i18n";

// Navbar inspirado en Nabule (Framer): barra superior + pill central + pill derecha.
// Incluye "top side corners" (SVG 20x20 con recorte circular) alineados a la pill central.

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";
const CORNER_PX = 20;

function TopBorderCorner({ side }: { side: "left" | "right" }) {
  const rawId = useId();
  const maskId = `mask-${rawId}`.replace(/[:]/g, "");

  // Recorte hacia adentro:
  // - left  => agujero bottom-right (cx=20, cy=20)
  // - right => agujero bottom-left  (cx=0,  cy=20)
  const cx = side === "left" ? 20 : 0;

  return (
    <svg viewBox="0 0 20 20" className="block h-5 w-5 text-white" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <circle cx={cx} cy="20" r="20" fill="black" />
        </mask>
      </defs>

      <rect x="0" y="0" width="20" height="20" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

type NavbarProps = {
  lang: Lang;
  onToggleLang: () => void;
};

export default function Navbar({ lang, onToggleLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  // Medimos el ancho real de la pill central para posicionar barra + corners
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [pillHalf, setPillHalf] = useState(56); // fallback

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setPillHalf(w / 2);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [scrolled]);

  const barHeightClass = scrolled ? "h-2.5" : "h-5"; // ~10px / ~20px

  return (
    <header
      className="fixed left-0 top-0 z-30 w-full pointer-events-none"
      style={{ ["--pill-half" as any]: `${pillHalf}px` }}
    >
      {/* Barra superior full-width */}
      <div className={["relative w-full", "transition-[height] duration-300", EASE, barHeightClass].join(" ")}
      >
        {/* Segmento CENTRO: arriba de la pill */}
        <div
          className="absolute inset-y-0 bg-white"
          style={{
            left: `calc(50% - var(--pill-half))`,
            right: `calc(50% - var(--pill-half))`,
          }}
          aria-hidden="true"
        />

        {/* Barra IZQUIERDA */}
        <div
          className="absolute inset-y-0 left-0 bg-white"
          style={{ right: `calc(50% + var(--pill-half) + 0px)` }}
          aria-hidden="true"
        />

        {/* Barra DERECHA */}
        <div
          className="absolute inset-y-0 right-0 bg-white"
          style={{ left: `calc(50% + var(--pill-half) + 0px)` }}
          aria-hidden="true"
        />

        {/* SVG IZQUIERDO */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `calc(50% - var(--pill-half) - 16px)`,
            width: `${CORNER_PX}px`,
            height: "100%",
            overflow: "hidden",
            top: "100%",
          }}
          aria-hidden="true"
        >
          <TopBorderCorner side="right" />
        </div>

        {/* SVG DERECHO */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `calc(50% + var(--pill-half) - 4px)`,
            width: `${CORNER_PX}px`,
            height: "100%",
            overflow: "hidden",
            top: "100%",
          }}
          aria-hidden="true"
        >
          <TopBorderCorner side="left" />
        </div>
      </div>

      {/* Pills */}
      <nav className="relative h-[35px] w-full overflow-visible">
        {/* CENTER pill */}
        <div
          ref={pillRef}
          className={[
            "absolute left-1/2 top-0 -translate-x-1/2",
            "bg-white",
            "rounded-b-[20px]",
            "min-h-[35px]",
            "px-[28px] pb-[6px] pt-0",
            "flex items-center justify-center",
            "pointer-events-auto",
            "transition-all duration-300",
            EASE,
          ].join(" ")}
        >
          <span className="font-logo text-3xl text-ink">
            {scrolled ? "e." : "e."}
          </span>
        </div>

        {/* RIGHT pill (language) — no desaparece en scroll */}
        <div
          className={[
            "absolute right-0 top-0",
            "bg-white",
            "rounded-bl-[20px] rounded-br-[20px]",
            "min-h-[35px]",
            "px-[6px] pb-[6px] pt-0",
            "flex items-center justify-center",
            "pointer-events-auto",
            "transition-all duration-300",
            EASE,
          ].join(" ")}
        >
          <button
            type="button"
            aria-label="Toggle language"
            onClick={onToggleLang}
            className="h-[29px] rounded-full border border-ink/10 bg-white px-4 text-xs font-medium text-ink shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-200 ease-in-out hover:shadow-[rgba(0,0,0,0.06)_0px_2px_4px_0px_inset]"
          >
            <span className={lang === "es" ? "font-semibold text-ink" : "text-ink/45"}>ES</span>
            <span className="mx-2 text-ink/25">|</span>
            <span className={lang === "en" ? "font-semibold text-ink" : "text-ink/45"}>EN</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
