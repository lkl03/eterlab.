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
  /** Static frame shown before the clip is ready (and when motion is reduced). */
  poster: string;
  alt: string;
  /** Extra classes for the media itself (both poster and video). */
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Cover that plays a short scroll-through of the real site.
 *
 * The clip is only fetched once the card is close to the viewport, plays while
 * visible and pauses when it leaves. `prefers-reduced-motion` keeps the static
 * poster instead, so the section never animates against the user's setting.
 */
export function ScrollPreview({
  video,
  poster,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // `armed` gates the network request; `playing` drives the crossfade.
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const enabled = Boolean(video) && !reduceMotion;

  useEffect(() => {
    if (!enabled) return;

    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer to gate on — load it, but off the effect body so the
      // first paint isn't blocked by a cascading render.
      const id = window.setTimeout(() => setArmed(true), 0);
      return () => window.clearTimeout(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setArmed(true);

          const el = videoRef.current;
          if (!el) continue;

          if (entry.isIntersecting) {
            const attempt = el.play();
            if (attempt) attempt.catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      // Start fetching a little before the card scrolls in so the swap is seamless.
      { rootMargin: "300px 0px", threshold: 0.2 }
    );

    io.observe(host);
    return () => io.disconnect();
  }, [enabled]);

  // Never leave a paused-but-visible clip behind if the tab was backgrounded.
  useEffect(() => {
    if (!enabled) return;
    const onVisibility = () => {
      const el = videoRef.current;
      if (!el || document.hidden) return;
      const attempt = el.play();
      if (attempt) attempt.catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  return (
    <div ref={hostRef} className="absolute inset-0 h-full w-full">
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-opacity duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          playing ? "opacity-0" : "opacity-100"
        } ${className}`}
      />

      {enabled && armed ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          poster={poster}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            playing ? "opacity-100" : "opacity-0"
          } ${className}`}
        >
          <source src={`${video}.webm`} type="video/webm" />
          <source src={`${video}.mp4`} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
