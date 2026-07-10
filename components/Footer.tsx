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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2Zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20h8.5A4.25 4.25 0 0020.5 15.25v-8.5A4.25 4.25 0 0016.25 3h-8.5ZM12 7a5 5 0 110 10 5 5 0 010-10Zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7Zm4.75-.75a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.47 1.34 4.98L2 22l5.2-1.36a9.94 9.94 0 004.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0012.04 2Zm0 1.8a8.13 8.13 0 015.78 2.39 8.11 8.11 0 012.4 5.77c0 4.5-3.67 8.16-8.18 8.16a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.09.81.82-3.01-.19-.31a8.11 8.11 0 01-1.25-4.33c0-4.5 3.67-8.16 8.17-8.16Zm-3.6 4.06c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.6.13.17 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.2-.58.2-1.08.14-1.19-.06-.1-.23-.16-.48-.29-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.81-.79.98-.15.16-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.48-.4-.42-.56-.43-.14 0-.31-.02-.48-.02Z" />
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

            <div className="mt-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45 gap-1">{c.footer.followUsOn}</div>
              <div className="flex flex-wrap gap-2 items-center">
              <a
                href={c.footer.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-white hover:text-ink"
              >
                <InstagramIcon />
              </a>
              <a
                href={c.footer.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-white hover:text-ink"
              >
                <TikTokIcon />
              </a>
              <a
                href={c.footer.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-white hover:text-ink"
              >
                <WhatsAppIcon />
              </a>
              </div>
            </div>
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





