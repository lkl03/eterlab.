export type Lang = "es" | "en";

export const COPY: Record<Lang, { desc: string; big: string; toggle: string }> = {
  es: {
    desc: "convirtiendo ideas en soluciones a través del diseño y desarrollo.",
    big: "En construcción...",
    toggle: "Switch to English",
  },
  en: {
    desc: "turning ideas into solutions through design & development.",
    big: "Coming Soon...",
    toggle: "Cambiar a Español",
  },
};

export const STORAGE_KEY = "lang";
