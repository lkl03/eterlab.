"use client";

import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";

import { COPY, type Lang } from "../../lib/i18n";
import { Button } from "../../components/ui/Button";
import { Reveal } from "../../components/ui/Reveal";
import { SectionTag } from "../../components/ui/SectionTag";
import { MouseTrail } from "../../components/ui/MouseTrail";

type Props = {
  lang: Lang;
};

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function ContactSection({ lang }: Props) {
  const c = COPY[lang];
  const sectionRef = useRef<HTMLElement | null>(null);

  const subjects = useMemo(
    () => [
      { id: "project", label: c.contact.subjectProject },
      { id: "subscription", label: c.contact.subjectSubscription },
      { id: "other", label: c.contact.subjectOther },
    ],
    [c]
  );

  const [subject, setSubject] = useState(subjects[0]?.id ?? "project");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden bg-paper py-32 sm:py-36">
      {/* Background + trail */}
      <div aria-hidden className="absolute inset-0 eter-contact-bg" />
      <MouseTrail
        targetRef={sectionRef}
        className="pointer-events-none absolute inset-0"
        colors={["rgba(138,180,255,0.36)", "rgba(255,139,211,0.28)"]}
        max={52}
        radius={54}
      />

      <div className="relative mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <Reveal>
              <SectionTag className="w-fit">{c.contact.tag}</SectionTag>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="eter-title mt-6 text-balance font-semibold tracking-tight text-ink">{c.contact.title}</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-ink/60 sm:text-base">
                {c.contact.desc}
              </p>
            </Reveal>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.08 }}
            className="rounded-[30px] border border-ink/10 bg-white/70 p-7 shadow-[0_18px_90px_rgba(17,17,26,0.10)] backdrop-blur sm:p-9"
            onSubmit={async (e) => {
              e.preventDefault();
              if (status === "sending") return;

              setStatus("sending");
              try {
                const subjectLabel = subjects.find((s) => s.id === subject)?.label ?? subject;
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name,
                    email,
                    subject: subjectLabel,
                    message,
                  }),
                });

                if (!res.ok) throw new Error("request_failed");

                setStatus("sent");
                setMessage("");
              } catch {
                setStatus("error");
              } finally {
                window.setTimeout(() => setStatus("idle"), 2400);
              }
            }}
          >
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-ink/60">{c.contact.nameLabel}</span>
                <input
                  className="h-11 rounded-2xl border border-ink/10 bg-paper px-4 text-sm text-ink outline-none transition focus:border-ink/20 focus:ring-2 focus:ring-ink/10"
                  placeholder={c.contact.namePlaceholder}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold text-ink/60">{c.contact.emailLabel}</span>
                <input
                  className="h-11 rounded-2xl border border-ink/10 bg-paper px-4 text-sm text-ink outline-none transition focus:border-ink/20 focus:ring-2 focus:ring-ink/10"
                  placeholder={c.contact.emailPlaceholder}
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <div className="grid gap-2">
                <span className="text-xs font-semibold text-ink/60">{c.contact.subjectLabel}</span>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSubject(s.id)}
                      className={
                        "cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ease-in-out " +
                        (subject === s.id
                          ? "border-ink bg-ink text-white shadow-[0_16px_50px_rgba(17,17,26,0.18)]"
                          : "border-ink/10 bg-paper text-ink/70 hover:border-ink/20")
                      }
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-xs font-semibold text-ink/60">{c.contact.messageLabel}</span>
                <textarea
                  className="min-h-[140px] resize-none rounded-2xl border border-ink/10 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-ink/20 focus:ring-2 focus:ring-ink/10"
                  placeholder={c.contact.messagePlaceholder}
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="dark"
                  type="submit"
                  ariaLabel="Send message"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? c.contact.sending
                    : status === "sent"
                      ? c.contact.sent
                      : status === "error"
                        ? c.contact.error
                        : c.contact.ctaPrimary}
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}


