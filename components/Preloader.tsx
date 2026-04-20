"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  onDone?: () => void;
};

/** Path relative to /public. */
const INTRO_AUDIO_SRC = "/audio/eterlab-intro.mp3";

/** Safety net: if the audio never ends (stalled network, long buffer, etc.),
 *  force the preloader to dismiss after this many ms. */
const AUDIO_MAX_WAIT_MS = 6000;

/** Fallback timing used when the audio can't play (autoplay blocked, file
 *  missing, reduced motion, etc.). Matches the original preloader behavior. */
const FALLBACK_TYPE_MS = 70;
const FALLBACK_SETTLE_MS = 420;

export default function Preloader({ onDone }: Props) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const FULL = "eterlab.";
  const [typed, setTyped] = useState(reduce ? FULL : "");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let typewriterInterval: number | undefined;
    let fallbackSettle: number | undefined;
    let audioMaxWait: number | undefined;

    const dismiss = () => {
      if (cancelled) return;
      setShow(false);
    };

    const startTypewriter = (): Promise<void> => {
      return new Promise((resolve) => {
        if (reduce) {
          setTyped(FULL);
          resolve();
          return;
        }
        setTyped("");
        let i = 0;
        typewriterInterval = window.setInterval(() => {
          if (cancelled) {
            if (typewriterInterval) window.clearInterval(typewriterInterval);
            typewriterInterval = undefined;
            resolve();
            return;
          }
          i += 1;
          setTyped(FULL.slice(0, i));
          if (i >= FULL.length) {
            if (typewriterInterval) window.clearInterval(typewriterInterval);
            typewriterInterval = undefined;
            resolve();
          }
        }, FALLBACK_TYPE_MS);
      });
    };

    /** Attempts to play the intro audio. Resolves to `true` if playback
     *  started successfully (we'll then wait for the `ended` event to
     *  dismiss), `false` otherwise. */
    const tryPlayAudio = async (): Promise<boolean> => {
      if (reduce) return false; // respect reduced motion: no audio
      if (typeof window === "undefined") return false;

      const audio = audioEl;
      if (!audio) return false;

      try {
        audio.currentTime = 0;
        audio.volume = 1;
        const playPromise = audio.play();
        // Older browsers may not return a promise.
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
        return true;
      } catch {
        // Autoplay blocked, file missing, or any other playback error.
        return false;
      }
    };

    // Snapshot the audio element at effect start so the cleanup below
    // references the same node that was mounted when the effect ran.
    const audioEl = audioRef.current;

    async function run() {
      // Lock scroll while the preloader is visible.
      document.documentElement.style.overflow = "hidden";

      // Wait for fonts so the typewriter doesn't flicker with a fallback face.
      try {
        await (document.fonts?.ready ?? Promise.resolve());
      } catch {}
      if (cancelled) return;

      // Start the typewriter immediately — it plays alongside the audio so
      // the visual rhythm matches the sound regardless of audio outcome.
      const typewriterPromise = startTypewriter();

      const audioOk = await tryPlayAudio();

      if (!audioOk) {
        // Fall back to the original timed behavior.
        await typewriterPromise;
        if (cancelled) return;
        fallbackSettle = window.setTimeout(() => {
          if (!cancelled) dismiss();
        }, reduce ? 250 : FALLBACK_SETTLE_MS);
        return;
      }

      // Audio is playing — wait for it to end (or a safety timeout) before
      // dismissing. The `onEnded` handler on the <audio> element takes care
      // of the happy path; this timeout is a safety net.
      audioMaxWait = window.setTimeout(() => {
        if (!cancelled) dismiss();
      }, AUDIO_MAX_WAIT_MS);
    }

    run();

    return () => {
      cancelled = true;
      if (typewriterInterval) window.clearInterval(typewriterInterval);
      if (fallbackSettle) window.clearTimeout(fallbackSettle);
      if (audioMaxWait) window.clearTimeout(audioMaxWait);
      // Best-effort stop audio if the preloader unmounts early.
      try {
        audioEl?.pause();
      } catch {}
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        onDone?.();
      }}
    >
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Audio element. preload="auto" so it's ready when play() is called.
              onEnded is the primary signal to dismiss the preloader. */}
          <audio
            ref={audioRef}
            src={INTRO_AUDIO_SRC}
            preload="auto"
            playsInline
            // webkit-playsinline is a non-standard legacy attribute for older iOS
            // Safari; JSX forwards unknown attributes to the DOM just fine.
            webkit-playsinline="true"
            onEnded={() => setShow(false)}
            className="hidden"
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="font-logo text-4xl text-ink sm:text-8xl">
              {typed}
              <span
                aria-hidden
                className={
                  "ml-[2px] inline-block h-[0.9em] w-[10px] translate-y-[2px] bg-ink/25 align-middle " +
                  (reduce ? "opacity-0" : "animate-pulse")
                }
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
