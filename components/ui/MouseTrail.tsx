"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
  /**
   * Two accent colors used for the trail (include alpha).
   * Example: ["rgba(138,180,255,0.35)", "rgba(255,139,211,0.28)"]
   */
  colors?: [string, string];
  /** Max number of particles on screen */
  max?: number;
  /** Base particle radius (px) */
  radius?: number;
  /** Spawn throttle (ms) */
  throttleMs?: number;
};

type Particle = {
  x: number;
  y: number;
  life: number; // 1 → 0
  r: number;
  color: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Canvas-based mouse trail. Lightweight, no extra deps.
 * Attach it to any section by passing `targetRef`.
 */
export function MouseTrail({
  targetRef,
  className,
  colors,
  max = 44,
  radius = 46,
  throttleMs = 14,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // IMPORTANT: keep primitive deps stable.
  // In the hero we re-render frequently (looping subtitle), and passing an array
  // literal for `colors` would otherwise cause the effect to teardown/re-init.
  const colorA = colors?.[0] ?? "rgba(138,180,255,0.35)";
  const colorB = colors?.[1] ?? "rgba(255,139,211,0.28)";

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = targetRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0;
    let h = 0;

    const particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let lastSpawn = 0;
    let lastPulse = 0;
    let inside = false;

    let lastPos: { x: number; y: number } | null = null;

    function resize() {
      const rect = el.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(el);
    resize();

    function spawn(x: number, y: number, mult = 1) {
      const color = Math.random() > 0.5 ? colorA : colorB;
      particles.push({
        x,
        y,
        life: 1,
        r: radius * mult * (0.75 + Math.random() * 0.55),
        color,
      });
      while (particles.length > max) particles.shift();
    }

    // We listen on *window* and compute whether the pointer is inside the target.
    // This avoids sporadic "no trail" cases when overlays intercept events.
    function onMove(ev: PointerEvent) {
      const rect = el.getBoundingClientRect();
      const isInside =
        ev.clientX >= rect.left &&
        ev.clientX <= rect.right &&
        ev.clientY >= rect.top &&
        ev.clientY <= rect.bottom;

      inside = isInside;
      if (!isInside) return;

      const x = clamp(ev.clientX - rect.left, 0, rect.width);
      const y = clamp(ev.clientY - rect.top, 0, rect.height);
      // Keep lastPos updated even if we throttle spawning.
      lastPos = { x, y };

      const now = performance.now();
      if (now - lastSpawn < throttleMs) return;
      lastSpawn = now;
      spawn(x, y);
    }

    window.addEventListener("pointermove", onMove, { passive: true });

    const onScroll = () => {
      inside = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    function draw(t: number) {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      // Keep a subtle presence even when the pointer is hovering but not moving.
      if (inside && lastPos && t - lastPulse > 120) {
        lastPulse = t;
        spawn(lastPos.x, lastPos.y, 0.55);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt * 1.35;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.9;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, p.color);
        g.addColorStop(1, "rgba(255,255,255,0)");

        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [prefersReducedMotion, targetRef, colorA, colorB, max, radius, throttleMs]);

  if (prefersReducedMotion) return null;

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

