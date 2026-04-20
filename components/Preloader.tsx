"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  onDone?: () => void;
};

export default function Preloader({ onDone }: Props) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const FULL = "eterlab.";
  const [typed, setTyped] = useState(reduce ? FULL : "");

  useEffect(() => {
    let cancelled = false;
    let interval: number | undefined;
    let afterDone: number | undefined;

    async function run() {
      // lock scroll mientras está el preloader
      document.documentElement.style.overflow = "hidden";

      try {
        // @ts-ignore
        await (document.fonts?.ready ?? Promise.resolve());
      } catch {}

      if (reduce) {
        setTyped(FULL);
        afterDone = window.setTimeout(() => {
          if (!cancelled) setShow(false);
        }, 250);
        return;
      }

      // Typewriter: character by character, then slide the preloader up.
      setTyped("");
      let i = 0;
      interval = window.setInterval(() => {
        i += 1;
        setTyped(FULL.slice(0, i));
        if (i >= FULL.length) {
          if (interval) window.clearInterval(interval);
          interval = undefined;
          afterDone = window.setTimeout(() => {
            if (!cancelled) setShow(false);
          }, 420);
        }
      }, 70);
    }

    run();

    return () => {
      cancelled = true;
      if (interval) window.clearInterval(interval);
      if (afterDone) window.clearTimeout(afterDone);
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

