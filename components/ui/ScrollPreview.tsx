"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  /**
   * Basename of the capture, without extension — e.g. "/work/previews/nodo".
   * The component looks for `${video}.webm` and `${video}.mp4`.
   * Leave undefined to fall back to the static poster only.
   */
  video?: string;
  /** Static frame shown while idle (and always when motion is reduced). */
  poster: string;
  alt: string;
  /** Plays while true — drive it with `useHoverPreview()` on the card. */
  active?: boolean;
  /** Extra classes for the media itself (both poster and video). */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Small corner badge hinting that the cover is a live preview. */
  showHint?: boolean;
  /** Badge colours: "light" sits on light covers, "dark" on dark ones. */
  hintTone?: "light" | "dark";
};

const FADE_MS = 500;

/**
 * Cover that plays a short capture of the real site while its card is active.
 *
 * Idle cards only show the poster. The clip's metadata is fetched once the card
 * nears the viewport so the first hover starts quickly; the video itself plays
 * only while `active`, and rewinds after fading back to the poster so the next
 * hover starts from the top. `prefers-reduced-motion` keeps the poster only.
 */
export function ScrollPreview({
  video,
  poster,
  alt,
  active = false,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  showHint = true,
  hintTone = "light",
}: Props) {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // `armed` mounts the <video>; `playing` drives the crossfade.
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const enabled = Boolean(video) && !reduceMotion;

  // Mount the video (metadata only) shortly before the card scrolls in.
  useEffect(() => {
    if (!enabled || armed) return;
    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setArmed(true), 0);
      return () => window.clearTimeout(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [enabled, armed]);

  // A hover can land before the observer fires (e.g. fast scroll + hover).
  const mounted = enabled && (armed || active);

  useEffect(() => {
    const el = videoRef.current;
    if (!mounted || !el) return;

    if (active) {
      el.preload = "auto";
      const attempt = el.play();
      if (attempt) attempt.catch(() => {});
      return;
    }

    el.pause();
    // Rewind once the poster has faded back in, so it never visibly jumps.
    const id = window.setTimeout(() => {
      if (!videoRef.current?.paused) return;
      try {
        videoRef.current.currentTime = 0;
      } catch {}
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [active, mounted]);

  const loading = enabled && active && !playing;
  const fade = `transition-opacity ease-[cubic-bezier(0.76,0,0.24,1)]`;

  return (
    <div ref={hostRef} className="absolute inset-0 h-full w-full">
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        className={`object-cover ${fade} ${playing ? "opacity-0" : "opacity-100"} ${className}`}
      />

      {mounted ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onWaiting={() => setPlaying(false)}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={`absolute inset-0 h-full w-full object-cover ${fade} ${
            playing ? "opacity-100" : "opacity-0"
          } ${className}`}
        >
          <source src={`${video}.webm`} type="video/webm" />
          <source src={`${video}.mp4`} type="video/mp4" />
        </video>
      ) : null}

      {enabled && showHint ? <PreviewHint state={playing ? "playing" : loading ? "loading" : "idle"} tone={hintTone} /> : null}
    </div>
  );
}

/** Corner badge: a play glyph while idle, a spinner while buffering, bars while playing. */
function PreviewHint({ state, tone }: { state: "idle" | "loading" | "playing"; tone: "light" | "dark" }) {
  const surface =
    tone === "dark"
      ? "border-white/15 bg-black/45 text-white/85"
      : "border-ink/10 bg-white/80 text-ink/70 shadow-[0_6px_20px_rgba(17,17,26,0.10)]";

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute bottom-3 right-3 z-[2] grid h-8 w-8 place-items-center rounded-full border backdrop-blur-md transition-opacity duration-300 ${surface}`}
    >
      {state === "idle" ? (
        <svg viewBox="0 0 16 16" className="ml-[1px] h-3 w-3" fill="currentColor">
          <path d="M4 2.8v10.4c0 .6.66.97 1.17.65l8.1-5.2a.77.77 0 000-1.3l-8.1-5.2A.77.77 0 004 2.8Z" />
        </svg>
      ) : state === "loading" ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
      ) : (
        <span className="flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="eter-eq w-[2px] rounded-full bg-current"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
