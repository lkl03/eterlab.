"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import PostPreloaderSound from "../components/PostPreloaderSound";
import MouseDot from "../components/MouseDot";
import SideMenu from "../components/SideMenu";
import VenceHeroV4 from "../components/VenceHeroV4";
import ProjectsSection from "../components/sections/ProjectsSection";
import FeaturedWorkSection from "../components/sections/FeaturedWorkSection";
import StatementSection from "../components/sections/StatementSection";
import ContactSection from "../components/sections/ContactSection";
import Footer from "../components/Footer";
import { COPY, Lang, LANG_KEY } from "../lib/i18n";
import { useActiveSection } from "../hooks/useActiveSection";

export default function Page() {
  const [lang, setLang] = useState<Lang>("es");
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Para empujar el contenido en desktop según ancho del menu
  const [sideW, setSideW] = useState<number>(56);

  // IDs que participan del “active link”
  const sectionIds = useMemo(() => ["projects", "work", "contact"], []);
  const activeId = useActiveSection(sectionIds);

  const navItems = useMemo(
    () => [
      { id: "projects", label: COPY[lang].nav.projects },
      { id: "work", label: COPY[lang].nav.work },
      { id: "contact", label: COPY[lang].nav.contact },
    ],
    [lang]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "es" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const onToggleLang = () => {
    const next: Lang = lang === "es" ? "en" : "es";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };

  const onNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-dvh bg-white text-ink"
      style={
        {
          ["--side-w" as any]: `${sideW}px`,
        } as React.CSSProperties
      }
    >
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}

      {/* Plays a short intro sound once, the moment the preloader finishes. */}
      <PostPreloaderSound trigger={preloaderDone} />

      <Navbar lang={lang} onToggleLang={onToggleLang} />

      <MouseDot />

      <SideMenu
        items={navItems}
        activeId={activeId}
        onItemClick={onNavigate}
        langLabel={COPY[lang].nav.toggle}
        onToggleLang={() => {
          const next: Lang = lang === "es" ? "en" : "es";
          setLang(next);
          try {
            localStorage.setItem(LANG_KEY, next);
          } catch {}
        }}
        onWidthChange={(w) => setSideW(w)}
      />

      <main className="bg-white">
        <VenceHeroV4 lang={lang} />
        <ProjectsSection lang={lang} />
        <FeaturedWorkSection lang={lang} />
        <StatementSection lang={lang} />
        <ContactSection lang={lang} />
        <Footer lang={lang} />
      </main>
    </div>
  );
}





