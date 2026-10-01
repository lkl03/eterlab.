import type React from "react";
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

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** Contact line (email, WhatsApp) — same hover glow as the side menu. */
function ContactLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative isolate inline-flex w-fit"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-0.14em] right-[-0.14em] bottom-[0.10em] top-[0.10em] rounded-2xl bg-[linear-gradient(90deg,rgba(138,180,255,0.40),rgba(255,139,211,0.32))] blur-[18px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <span className="relative z-10 block rounded-2xl px-4 py-1.5">
        <span className="text-lg font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-ink/80 sm:text-2xl">
          {children}
        </span>
      </span>
    </a>
  );
}

export default function Footer({ lang }: Props) {
  const c = COPY[lang];
  const year = new Date().getFullYear();

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
              <div className="mt-2 flex flex-col">
                <ContactLink href={`mailto:${c.footer.email}`}>{c.footer.email}</ContactLink>
                <ContactLink href={c.footer.social.whatsapp} external>
                  <span className="sr-only">WhatsApp </span>
                  {c.footer.whatsappNumber}
                </ContactLink>
              </div>
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
                href={c.footer.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink/70 backdrop-blur transition-colors duration-300 ease-in-out hover:bg-white hover:text-ink"
              >
                <LinkedInIcon />
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





