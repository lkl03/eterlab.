"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { COPY, Lang, STORAGE_KEY } from "@/lib/i18n";

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "es" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  return (
    <main className="min-h-dvh font-body">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end px-4 py-4 sm:px-6">
        <LanguageSwitch lang={lang} setLang={setLang} />
      </div>

      {/* Centered content */}
      <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 pb-12 text-center">
        <div className="w-full max-w-70">
          <Image
            src="/logo.avif"
            alt="Logo"
            width={840}
            height={840}
            priority
            className="h-auto w-full select-none"
          />
        </div>

        <p className="max-w-prose text-2xl font-light leading-relaxed text-[#212121] select-none">
          {COPY[lang].desc}
        </p>

        <p className="font-title text-2xl text-[#212121] font-semibold tracking-tight">
          {COPY[lang].big}
        </p>

        <a href="mailto:contact.eterlab@gmail.com?Subject=Web Lead -- "  className="mt-4 rounded-lg border border[#212121] px-6 py-3 text-[#212121] hover:bg-[#212121] hover:text-white transition-all ease-in-out duration-300">
          {COPY[lang].cta}
        </a>
      </div>
    </main>
  );
}

