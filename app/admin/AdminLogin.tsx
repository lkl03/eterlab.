"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, Smartphone, TriangleAlert, ArrowRight } from "lucide-react";
import { MouseTrail } from "../../components/ui/MouseTrail";

type Stage = "credentials" | "twofa";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const inputCls =
  "h-12 w-full rounded-full border border-ink/10 bg-white/90 pl-11 pr-5 text-[15px] text-ink placeholder:text-ink/30 " +
  "transition-[border-color,box-shadow] duration-200 focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/[0.06]";

export function AdminLogin({ configured, onSuccess }: { configured: boolean; onSuccess: (email: string) => void }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [token, setToken] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(withToken: boolean) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          pin,
          ...(withToken ? { token: token.trim(), remember } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        onSuccess(email.trim().toLowerCase());
        return;
      }
      if (data.twofaRequired) {
        setStage("twofa");
        setError(data.error === "invalid_2fa" ? "El código no es válido. Probá de nuevo." : null);
        if (data.error === "invalid_2fa") setToken("");
        return;
      }
      if (res.status === 503 || data.error === "not_configured") {
        setError("El panel no está configurado en este entorno.");
        return;
      }
      if (res.status === 429) {
        setError("Demasiados intentos. Esperá unos minutos.");
        return;
      }
      setError("Credenciales inválidas.");
    } catch {
      setError("No se pudo conectar. Reintentá.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper px-4 py-12"
    >
      <div aria-hidden className="absolute inset-0 eter-gradient-bg" />
      <MouseTrail
        targetRef={sectionRef}
        className="pointer-events-none absolute inset-0"
        colors={["rgba(138,180,255,0.32)", "rgba(255,139,211,0.24)"]}
        max={40}
        radius={48}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative w-full max-w-[420px]"
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="font-logo eter-bubble select-none text-6xl leading-none text-ink">eterlab.</span>
          <span className="rounded-full border border-ink/15 bg-paper/70 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55 backdrop-blur">
            admin
          </span>
        </div>

        <div className="rounded-[30px] border border-ink/10 bg-white/70 p-7 shadow-[0_18px_90px_rgba(17,17,26,0.10)] backdrop-blur sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Panel interno</h1>
            <StepDots stage={stage} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/55">
            {stage === "credentials"
              ? "Ingresá con tu email y PIN autorizados."
              : "Ingresá el código de 6 dígitos de Google Authenticator."}
          </p>

          {!configured && (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-3.5 text-xs leading-relaxed text-amber-900">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                El panel no está configurado. Definí las variables <code className="font-semibold">ADMIN_*</code> en el entorno.
              </span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) submit(stage === "twofa");
            }}
            className="mt-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              {stage === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-4"
                >
                  <Field label="Email" htmlFor="admin-email" icon={<Mail className="h-4 w-4" />}>
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="vos@eterlab.co"
                    />
                  </Field>
                  <Field label="PIN" htmlFor="admin-pin" icon={<Lock className="h-4 w-4" />}>
                    <input
                      id="admin-pin"
                      type="password"
                      inputMode="numeric"
                      autoComplete="current-password"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className={`${inputCls} tracking-[0.3em]`}
                      placeholder="••••"
                    />
                  </Field>
                </motion.div>
              ) : (
                <motion.div
                  key="twofa"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-4"
                >
                  <Field label="Código de verificación" htmlFor="admin-totp" icon={<Smartphone className="h-4 w-4" />}>
                    <input
                      id="admin-totp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                      className={`${inputCls} tabular-nums tracking-[0.45em]`}
                      placeholder="000000"
                      autoFocus
                    />
                  </Field>
                  <label className="flex cursor-pointer select-none items-center gap-3 pl-1 text-sm text-ink/65">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-ink/20 accent-[rgb(33,33,33)]"
                    />
                    Recordar este dispositivo por 30 días
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p role="alert" className="mt-4 pl-1 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !configured}
              className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/10 bg-ink text-[15px] font-semibold text-white shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_12px_40px_rgba(17,17,26,0.18)] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {stage === "credentials" ? "Continuar" : "Verificar y entrar"}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0.5" />
              )}
            </button>

            {stage === "twofa" && (
              <button
                type="button"
                onClick={() => {
                  setStage("credentials");
                  setToken("");
                  setError(null);
                }}
                className="mt-3 w-full text-center text-xs font-semibold text-ink/45 transition-colors hover:text-ink"
              >
                Volver
              </button>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink/40">Acceso restringido · eterlab.</p>
      </motion.div>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block pl-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function StepDots({ stage }: { stage: Stage }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={stage === "credentials" ? "Paso 1 de 2" : "Paso 2 de 2"}>
      <span className="h-1.5 w-5 rounded-full bg-ink" />
      <span
        className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          stage === "twofa" ? "w-5 bg-ink" : "w-1.5 bg-ink/20"
        }`}
      />
    </div>
  );
}
