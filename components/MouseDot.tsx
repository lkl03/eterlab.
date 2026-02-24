"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseDot() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();

    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);

    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      // smoothing
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[80] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/80 bg-transparent backdrop-blur-[1px]"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/5"
      />
    </>
  );
}
