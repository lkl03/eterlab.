import { ChevronUp } from "lucide-react";

import { COPY, type Lang } from "../lib/i18n";

type Props = {
  lang: Lang;
};

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M19.78 7.39c-1.12-.71-2-1.75-2.45-2.99-.12-.32-.2-.65-.25-.98h-3.53v11.2c0 1.23-1 2.24-2.24 2.24-1.23 0-2.24-1-2.24-2.24 0-1.23 1-2.24 2.24-2.24.23 0 .45.04.66.1V8.67c-.22-.03-.44-.05-.66-.05-3.01 0-5.45 2.44-5.45 5.45S8.26 19.52 11.27 19.52c3.01 0 5.45-2.44 5.45-5.45V10.8c1.12.8 2.49 1.27 3.96 1.27V8.64c-.88 0-1.73-.26-2.45-.75Z" />
    </svg>
  );
}

export default function Footer({ lang }: Props) {
  const c = COPY[lang];
  const year = new Date().getFullYear();

  // Match SideMenu hover glow exactly.
  const hoverOutlineClass =
    "pointer-events-none absolute left-[-0.14em] right-[-0.14em] bottom-[0.10em] top-[0.10em] -z-10 rounded-2xl " +
    "bg-[linear-gradient(90deg,rgba(138,180,255,0.40),rgba(255,139,211,0.32))] blur-[18px] opacity-0 transition-opacity duration-200 group-hover:opacity-100";

  return (
    <footer className="bg-paper">
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))] py-20 sm:py-24">
        {/* top row: contact block (left) + wordmark (right) */}
        <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
          {/* contact block (moved here from Contact section) */}
          <div className="max-w-lg">
            {c.footer.phone ? <div className="text-sm font-semibold text-ink/55">{c.footer.phone}</div> : null}

            <div className={c.footer.phone ? "mt-8" : ""}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">{c.footer.emailUs}</div>
              <a
                href={`mailto:${c.footer.email}`}
                className="group relative isolate mt-2 inline-flex w-fit"
              >
                {/* glow (no z negativo) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[-0.14em] right-[-0.14em] bottom-[0.10em] top-[0.10em] rounded-2xl
      bg-[linear-gradient(90deg,rgba(138,180,255,0.40),rgba(255,139,211,0.32))]
      blur-[18px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span className="relative z-10 block rounded-2xl px-4 py-2">
                  <span className="text-lg font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-ink/80 sm:text-2xl">
                    {c.footer.email}
                  </span>
                </span>
              </a>
            </div>

            {/*<div className="mt-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">{c.footer.followUsOn}</div>
              <a
                href={c.footer.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-white hover:text-ink"
              >
                <TikTokIcon />
              </a>
            </div>*/}
          </div>

          {/* wordmark */}
          <div
            className="font-logo eter-bubble-title select-none text-right font-medium tracking-tight text-ink"
            style={{ fontSize: "clamp(60px,10vw,120px)", lineHeight: "0.82em" }}
          >
            e.
          </div>
        </div>
      </div>

      {/* dark bar */}
      <div className="bg-ink">
        <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-6 py-7">
          <div className="text-sm font-medium text-white/70">
            ©{year} {c.footer.copy}
          </div>
          <button
            type="button"
            aria-label={c.footer.backToTop}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
            onClick={() => {
              const el = document.querySelector("#home");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              else window.location.href = "/#home";
            }}
          >
            <ChevronUp className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-[0.12em]">{c.footer.backToTop}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}





