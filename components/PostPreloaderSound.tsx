"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Path under /public. */
  src?: string;
  /** When this flips to true the sound plays exactly once. */
  trigger: boolean;
};

/**
 * Plays a short intro sound once, the first time `trigger` becomes true.
 *
 * Used from <Page> to play a sound the moment the preloader finishes and the
 * main content becomes visible.
 *
 * Notes
 * - Browsers generally block programmatic audio playback without a prior user
 *   gesture on the origin. If play() rejects we swallow the rejection so the
 *   rest of the UI is never affected.
 * - The audio element is kept mounted (just hidden) so playback doesn't get
 *   torn down mid-play. It's harmless if it never plays.
 * - `prefers-reduced-motion` is respected: we don't play anything if the user
 *   has that preference set.
 */
export default function PostPreloaderSound({
  src = "/audio/eterlab-intro-song.mp3",
  trigger,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    if (playedRef.current) return;
    if (typeof window === "undefined") return;

    // Respect reduced motion: skip the intro sound entirely.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      playedRef.current = true;
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    playedRef.current = true;

    try {
      audio.currentTime = 0;
      audio.volume = 1;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        // Swallow autoplay rejections silently — there's nothing meaningful
        // we can do if the browser blocks the sound and we don't want to
        // affect the rest of the page.
        playPromise.catch(() => {});
      }
    } catch {
      // Same treatment for synchronous errors.
    }
  }, [trigger]);

  return (
    <audio
      ref={audioRef}
      src={src}
      preload="auto"
      playsInline
      className="hidden"
      aria-hidden
    />
  );
}
