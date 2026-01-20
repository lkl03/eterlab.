"use client";

import { Lang, COPY, STORAGE_KEY } from "@/lib/i18n";

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export default function LanguageSwitch({ lang, setLang }: Props) {
  const next = lang === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => {
        setLang(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {}
      }}
      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 active:bg-zinc-100"
      aria-label="Switch language"
    >
      {COPY[lang].toggle}
    </button>
  );
}