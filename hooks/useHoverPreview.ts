"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";

/**
 * Decides when a card's live preview should play.
 *
 * - Pointer devices: only while the card is hovered (or focused from the
 *   keyboard), so a page full of cards never plays everything at once.
 * - Touch devices have no hover, so the card plays while it sits in the
 *   middle of the screen and stops once it scrolls away.
 *
 * Spread `bind` on the card and attach `ref` to it; pass `active` to
 * <ScrollPreview />.
 */
export function useHoverPreview<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [canHover, setCanHover] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (canHover) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setCentered(entry.isIntersecting),
      // Only the middle band of the screen counts, so one card plays at a time.
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canHover]);

  const bind = {
    onPointerEnter: (e: PointerEvent<T>) => {
      if (e.pointerType === "mouse") setHovered(true);
    },
    onPointerLeave: (e: PointerEvent<T>) => {
      if (e.pointerType === "mouse") setHovered(false);
    },
    onFocus: () => setHovered(true),
    onBlur: (e: FocusEvent<T>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
    },
  };

  return { ref, bind, active: canHover ? hovered : centered };
}
