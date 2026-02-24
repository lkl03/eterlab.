"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Scrollspy hook.
 *
 * IntersectionObserver can be flaky with large sections + heavy motion layers.
 * This approach is deterministic: we sample section positions on scroll (rAF-throttled)
 * and pick the section whose top is closest to a target line in the viewport.
 */
export function useActiveSection(sectionIds: string[]) {
  const ids = useMemo(() => sectionIds, [sectionIds.join("|")]);
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  const activeRef = useRef(activeId);
  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    let raf = 0;

    const compute = () => {
      // Choose a stable reference line (a bit below the top) so the active link
      // changes at a natural moment while scrolling.
      const targetY = window.innerHeight * 0.32;

      let bestId = activeRef.current;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const el of els) {
        const rect = el.getBoundingClientRect();

        // Ignore sections that are completely outside the viewport.
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;

        const dist = Math.abs(rect.top - targetY);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = el.id;
        }
      }

      if (bestId && bestId !== activeRef.current) {
        activeRef.current = bestId;
        setActiveId(bestId);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    // First pass
    compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);

  return activeId;
}
