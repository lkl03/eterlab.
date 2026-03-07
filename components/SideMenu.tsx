"use client";

import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Lang } from "../lib/i18n";

type Item = { id: string; label: string };

type Props = {
  items: Item[];
  activeId: string;
  onItemClick: (id: string) => void;
  /** Current language (recommended). If omitted, we fall back to <html lang="...">. */
  lang?: Lang;
  /** Backward-compat: some callers used to pass a label instead of the actual lang. */
  langLabel?: string;
  onToggleLang: () => void;
  onWidthChange?: (w: number) => void;
};

const CLOSED_W = 68;
const OPEN_W = 320;

const EASE_IO: [number, number, number, number] = [0.76, 0, 0.24, 1];

const rail = {
  closed: { width: CLOSED_W },
  open: { width: OPEN_W },
} as const;

const panel = {
  closed: { opacity: 0, x: -10, filter: "blur(10px)" },
  open: { opacity: 1, x: 0, filter: "blur(0px)" },
} as const;

const list = {
  closed: {},
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
} as const;

const li = {
  closed: { opacity: 0, y: 10, filter: "blur(10px)" },
  open: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

function PlusToX({ open }: { open: boolean }) {
  return (
    <motion.div
      className="relative grid place-items-center"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.28, ease: EASE_IO }}
    >
      <div className="absolute h-[4px] w-8 rounded-full" style={{ background: "#212121" }} />
      <div className="absolute h-8 w-[4px] rounded-full" style={{ background: "#212121" }} />
    </motion.div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SideMenu({
  items,
  activeId,
  onItemClick,
  lang,
  langLabel,
  onToggleLang,
  onWidthChange,
}: Props) {
  // Desktop rail (>=2xl): hover abre, click fija
  const [pinned, setPinned] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const open = pinned || hoverOpen;

  // <2xl drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // hover highlight (para hover FX)
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const highlightId = hoveredId ?? null;

  // Evita que el contenido “se desplace” con la expansión del rail
  useEffect(() => {
    onWidthChange?.(CLOSED_W);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock scroll cuando está abierto el drawer (<2xl)
  useEffect(() => {
    if (!drawerOpen) {
      document.documentElement.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  const togglePinned = () => {
    setPinned((v) => !v);
    setHoverOpen(true);
  };

  const lowerLabel = (s: string) => s.toLowerCase();

  const railShadow =
    "rgba(17, 17, 26, 0.05) 0px 4px 16px, rgba(17, 17, 26, 0.06) 0px 8px 24px, rgba(17, 17, 26, 0.06) 0px 16px 56px";

  // Language pill state
  // If caller forgets to pass `lang`, we still reflect the active language by reading <html lang>.
  const [docLang, setDocLang] = useState<Lang>("en");
  useEffect(() => {
    const read = () => {
      const raw = (document.documentElement.lang || "en").toLowerCase();
      setDocLang(raw === "es" ? "es" : "en");
    };
    read();

    const mo = new MutationObserver(() => read());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => mo.disconnect();
  }, []);

  // last resort fallback (if neither prop nor html lang are usable)
  const labelFallback: Lang = (langLabel || "").toLowerCase() === "es" ? "es" : "en";
  const currentLang: Lang = lang ?? docLang ?? labelFallback;
  const isES = currentLang === "es";

  // ======== Viewport mode (mobile vs tablet/notebook) ========
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)"); // mobile <sm
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ======== Handle opener (<2xl) =========
  const handleDragX = useRef(0);
  const handleX = useMotionValue(0);

  const resetHandlePosition = (immediate = false) => {
    handleDragX.current = 0;

    if (immediate) {
      handleX.set(0);
      return;
    }

    animate(handleX, 0, {
      duration: 0.18,
      ease: EASE_IO,
    });
  };

  // ======== Drawer motion values =========
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelW, setPanelW] = useState(360);

  // Motion value del drawer X (0 = abierto, -panelW = cerrado)
  const x = useMotionValue(-360);

  // Backdrop opacity proporcional (0..MAX_BACKDROP)
  const MAX_BACKDROP = 0.1;
  const [backdropOpacity, setBackdropOpacity] = useState(0);

  // progreso 0..1, usado para fade del handle
  const [openProgress, setOpenProgress] = useState(0);

  useEffect(() => {
    const unsub = x.on("change", (val) => {
      const w = panelW || 360;
      const t = 1 - Math.min(1, Math.abs(val) / w); // 0..1
      setOpenProgress(t);
      setBackdropOpacity(MAX_BACKDROP * t);
    });
    return () => unsub();
  }, [x, panelW]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width;
      if (w && Number.isFinite(w)) setPanelW(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [drawerOpen]);

  // Garantiza que el handle nunca quede “colgado” después de cerrar
  useEffect(() => {
    if (!drawerOpen) {
      resetHandlePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  const ensureClosedPosition = () => {
    const w = panelW || 360;
    x.set(-w);
  };

  const openDrawer = () => {
    resetHandlePosition(true);
    setDrawerOpen(true);

    requestAnimationFrame(() => {
      const w = panelW || 360;
      x.set(-w);
      animate(x, 0, { duration: 0.42, ease: EASE_IO });
    });
  };

  const closeDrawer = async () => {
    const w = panelW || 360;
    await animate(x, -w, { duration: 0.34, ease: EASE_IO }).finished;
    setDrawerOpen(false);
    resetHandlePosition(true);
  };

  // ======== Edge swipe / edge drag (ONLY mobile) =========
  useEffect(() => {
    if (!isMobile) return;

    let tracking = false;
    let startedOpen = false;
    let startX = 0;
    let startY = 0;

    const EDGE = 18; // px desde borde izquierdo para activar
    const SLOP = 14;

    const begin = (clientX: number, clientY: number) => {
      if (drawerOpen) return;
      if (clientX > EDGE) return;

      tracking = true;
      startedOpen = false;
      startX = clientX;
      startY = clientY;
    };

    const move = (clientX: number, clientY: number) => {
      if (!tracking) return;

      const dx = clientX - startX;
      const dy = Math.abs(clientY - startY);

      // si es vertical, cancelamos para no romper scroll
      if (dy > SLOP && dy > Math.abs(dx)) {
        tracking = false;
        return;
      }

      // arrancamos “modo arrastre” abriendo el drawer en estado cerrado
      if (!startedOpen && dx > 2) {
        startedOpen = true;
        setDrawerOpen(true);
        requestAnimationFrame(() => {
          ensureClosedPosition();
        });
      }

      if (startedOpen) {
        const w = panelW || 360;
        const nextX = clamp(-w + dx, -w, 0);
        x.set(nextX);
      }
    };

    const end = () => {
      if (!tracking) return;
      tracking = false;

      if (!startedOpen) return;

      const w = panelW || 360;
      const currentX = x.get();
      const shouldOpen = currentX > -w * 0.55;

      if (shouldOpen) {
        animate(x, 0, { duration: 0.22, ease: EASE_IO });
      } else {
        animate(x, -w, { duration: 0.22, ease: EASE_IO }).finished.then(() => {
          setDrawerOpen(false);
          resetHandlePosition(true);
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => begin(e.clientX, e.clientY);
    const onPointerMove = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onPointerUp = () => end();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      begin(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onMouseUp = () => end();

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches?.[0]) return;
      begin(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches?.[0]) return;
      move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => end();

    document.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true, capture: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true, capture: true });

    document.addEventListener("mousedown", onMouseDown, { passive: true, capture: true });
    document.addEventListener("mousemove", onMouseMove, { passive: true, capture: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true, capture: true });

    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true, capture: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, { capture: true });
      document.removeEventListener("pointermove", onPointerMove, { capture: true });
      document.removeEventListener("pointerup", onPointerUp, { capture: true });

      document.removeEventListener("mousedown", onMouseDown, { capture: true });
      document.removeEventListener("mousemove", onMouseMove, { capture: true });
      document.removeEventListener("mouseup", onMouseUp, { capture: true });

      document.removeEventListener("touchstart", onTouchStart, { capture: true });
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("touchend", onTouchEnd, { capture: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, drawerOpen, panelW]);

  // Hover outline (same vibe as "why eterlab" glow). ONLY applied in desktop rail (>=2xl).
  const hoverOutlineClass =
    "pointer-events-none absolute left-[-0.14em] right-[-0.14em] bottom-[0.10em] top-[0.10em] -z-10 rounded-2xl " +
    "bg-[linear-gradient(90deg,rgba(138,180,255,0.40),rgba(255,139,211,0.32))] blur-[18px] transition-opacity duration-200";

  return (
    <>
      {/* ===================== DESKTOP RAIL (>=2xl) ===================== */}
      <motion.aside
        className="fixed left-0 top-0 z-40 hidden h-dvh 2xl:flex flex-col"
        style={{
          background: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: railShadow,
        }}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={rail}
        transition={{ type: "tween", duration: 0.42, ease: EASE_IO }}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => {
          if (!pinned) setHoverOpen(false);
        }}
        onClick={togglePinned}
      >
        <div className="absolute right-0 top-0 h-full w-px" style={{ background: "rgba(33,33,33,0.06)" }} />

        <div className="relative flex h-24 items-center justify-center">
          <button
            type="button"
            aria-label={pinned ? "Unpin menu" : "Pin menu"}
            onClick={(e) => {
              e.stopPropagation();
              togglePinned();
            }}
            className="relative grid size-12 place-items-center"
          >
            <PlusToX open={open} />
            <span
              aria-hidden
              className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full"
              style={{
                background: "#212121",
                opacity: pinned ? 0.22 : 0,
                transition: "opacity 200ms cubic-bezier(0.76,0,0.24,1)",
              }}
            />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex h-full flex-col px-10 pb-10"
            initial={false}
            animate={open ? "open" : "closed"}
            variants={panel}
            transition={{ duration: 0.35, ease: EASE_IO }}
            style={{ pointerEvents: open ? "auto" : "none" }}
          >
            <div className="flex flex-1 items-center justify-center">
              <nav>
                <motion.ul variants={list} className="flex flex-col items-center justify-center gap-5">
                  {items.map((it) => {
                    const isActive = it.id === activeId;
                    const isHovered = it.id === highlightId;

                    return (
                      <motion.li key={it.id} variants={li} transition={{ duration: 0.4, ease: EASE_IO }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemClick(it.id);
                          }}
                          onMouseEnter={() => setHoveredId(it.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className="relative block cursor-pointer select-none text-center font-title"
                          style={{ color: "#212121", textTransform: "lowercase" }}
                        >
                          <span className="relative block rounded-2xl px-4 py-2">
                            <span aria-hidden className={hoverOutlineClass} style={{ opacity: isHovered ? 1 : 0 }} />
                            <span className="relative block text-[40px] leading-[1.03] tracking-tight">
                              {lowerLabel(it.label)}
                            </span>
                          </span>

                          <motion.span
                            aria-hidden
                            className="absolute -right-5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }}
                            transition={{ duration: 0.18, ease: EASE_IO }}
                            style={{ background: "#212121" }}
                          />
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>
            </div>

            <div className="pt-6 flex items-center justify-center desk:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLang();
                }}
                className="rounded-full px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase"
                style={{
                  color: "#212121",
                  background: "rgba(241,241,241,0.45)",
                  border: "1px solid rgba(33,33,33,0.06)",
                  boxShadow: "rgba(17, 17, 26, 0.06) 0px 10px 24px",
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={(isES ? "font-extrabold text-ink" : "font-semibold text-ink/35") + " transition-colors"}>ES</span>
                  <span className="text-ink/25">|</span>
                  <span className={(!isES ? "font-extrabold text-ink" : "font-semibold text-ink/35") + " transition-colors"}>EN</span>
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* ===================== <2xl HANDLE OPENER (fade con progreso) ===================== */}
      <div
        className="fixed left-0 top-1/2 z-60 2xl:hidden"
        style={{
          transform: "translateY(-50%)",
          pointerEvents: drawerOpen ? "none" : "auto",
        }}
      >
        <motion.div
          style={{
            x: handleX,
            touchAction: "none",
            opacity: 1 - openProgress,
            filter: "blur(0px)",
          }}
          initial={false}
          animate={{ opacity: 1 - openProgress }}
          transition={{ duration: 0.12 }}
          drag={drawerOpen ? false : "x"}
          dragConstraints={{ left: 0, right: 90 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDrag={(e, info) => {
            handleDragX.current = info.offset.x;
          }}
          onDragEnd={() => {
            if (drawerOpen) {
              resetHandlePosition();
              return;
            }

            const shouldOpen = handleDragX.current > 36;
            resetHandlePosition();

            if (shouldOpen) {
              openDrawer();
            }
          }}
          onClick={() => {
            if (!drawerOpen) openDrawer();
          }}
          role="button"
          aria-label="Open menu"
        >
          <div
            className="flex h-20 w-9 items-center justify-center rounded-r-full"
            style={{
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(33,33,33,0.06)",
              boxShadow: "rgba(17, 17, 26, 0.06) 0px 12px 28px",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {isMobile ? (
              <div className="h-10 w-1 rounded-full" style={{ background: "rgba(33,33,33,0.20)" }} />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="rgba(33,33,33,0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===================== <2xl DRAWER ===================== */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div className="fixed inset-0 z-[70] 2xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Backdrop: opacity proporcional al % de apertura */}
            <motion.button
              className="absolute inset-0"
              aria-label="Close menu backdrop"
              onClick={() => closeDrawer()}
              style={{
                backgroundColor: "#212121",
                opacity: backdropOpacity,
              }}
            />

            <motion.div
              ref={panelRef}
              className="absolute left-0 top-0 h-full w-[min(84vw,360px)] bg-white"
              style={{
                boxShadow: railShadow,
                x,
                touchAction: "pan-y",
              }}
              drag="x"
              dragConstraints={{ left: -(panelW || 360), right: 0 }}
              dragElastic={0.08}
              dragMomentum={false}
              onDragEnd={(e, info) => {
                const w = panelW || 360;
                const currentX = x.get();

                const shouldClose = currentX < -w * 0.55 || info.velocity.x < -300;
                if (shouldClose) {
                  closeDrawer();
                } else {
                  animate(x, 0, { duration: 0.22, ease: EASE_IO });
                }
              }}
            >
              <div className="flex items-center justify-center pt-6">
                <button onClick={() => closeDrawer()} aria-label="Close menu" className="grid size-12 place-items-center">
                  <PlusToX open />
                </button>
              </div>

              <div className="flex h-[calc(100%-140px)] flex-col items-center justify-center px-6">
                <motion.ul variants={list} initial="closed" animate="open" className="flex flex-col items-center gap-5">
                  {items.map((it) => {
                    const isActive = it.id === activeId;
                    return (
                      <motion.li key={it.id} variants={li} transition={{ duration: 0.4, ease: EASE_IO }}>
                        <button
                          onClick={() => {
                            onItemClick(it.id);
                            closeDrawer();
                          }}
                          className="relative block cursor-pointer select-none text-center font-title"
                          style={{ color: "#212121", textTransform: "lowercase" }}
                        >
                          <span className="block rounded-2xl px-4 py-2">
                            <span className="block text-3xl leading-[1.05] tracking-tight">{lowerLabel(it.label)}</span>
                          </span>

                          <motion.span
                            aria-hidden
                            className="absolute -right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }}
                            transition={{ duration: 0.18, ease: EASE_IO }}
                            style={{ background: "#212121" }}
                          />
                        </button>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <div className="mt-10 desk:hidden">
                  <button
                    onClick={onToggleLang}
                    className="rounded-full px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase"
                    style={{
                      color: "#212121",
                      background: "rgba(241,241,241,0.45)",
                      border: "1px solid rgba(33,33,33,0.06)",
                      boxShadow: "rgba(17, 17, 26, 0.06) 0px 10px 24px",
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className={(isES ? "font-extrabold text-ink" : "font-semibold text-ink/35") + " transition-colors"}>ES</span>
                      <span className="text-ink/25">|</span>
                      <span className={(!isES ? "font-extrabold text-ink" : "font-semibold text-ink/35") + " transition-colors"}>EN</span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}