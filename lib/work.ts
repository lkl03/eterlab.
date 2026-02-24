import type { Lang } from "./i18n";

export type Localized<T = string> = Record<Lang, T>;

export type WorkSection = {
  title: Localized;
  body: Localized;
};

export type Work = {
  slug: string;
  title: string;
  badge: Localized; // small label shown in cards
  summary: Localized;
  year: string;
  role: Localized;
  readingTime: Localized;
  stack: string[];
  liveUrl?: string;
  coverByLang?: Record<Lang, string>;
  coverImage: string; // path inside /public
  sections: WorkSection[];
  /** Optional flag for not-yet-launched items */
  comingSoon?: boolean;
};

const CURRENT_YEAR = String(new Date().getFullYear());

/** Featured work on the homepage. */
export const LATEST_WORK_SLUG = "bioprotece3d";

export const WORKS: Work[] = [
  {
    slug: "bioprotece3d",
    title: "Bioprotece3D",
    badge: {
      es: "sitio para cliente",
      en: "client website",
    },
    summary: {
      es: "Nueva web para Bioprotece3D — rediseño y desarrollo con foco en claridad, estructura y performance.",
      en: "New website for Bioprotece3D — redesign + build focused on clarity, structure and performance.",
    },
    year: "2026",
    role: {
      es: "diseño • frontend",
      en: "design • frontend",
    },
    readingTime: {
      es: "3 min",
      en: "3 min",
    },
    stack: ["next.js", "typescript", "tailwind", "motion"],
    liveUrl: "https://bioprotece3d.com",
    coverByLang: {
      es: "/work/bioprotece3d-cover-es.jpg",
      en: "/work/bioprotece3d-cover-en.jpg",
    },
    coverImage: "/work/bioprotece3d-cover.svg",
    sections: [
      {
        title: { es: "contexto", en: "context" },
        body: {
          es: `Bioprotece3D necesitaba una web más clara y confiable: información ordenada, jerarquías limpias y un sistema visual consistente.

El objetivo fue simplificar la narrativa y hacer que el sitio cargue rápido sin perder detalle.`,
          en: `Bioprotece3D needed a clearer, more trustworthy website: structured information, clean hierarchy and a consistent visual system.

The goal was to simplify the narrative and keep the site fast without losing detail.`,
        },
      },
      {
        title: { es: "qué hicimos", en: "what we built" },
        body: {
          es: `- Rediseño de layout y tipografía para mejorar lectura y foco.
- Componentes reutilizables para escalar secciones.
- Ajustes de performance (imágenes, pesos y micro-interacciones).`,
          en: `- Layout + typography redesign to improve readability and focus.
- Reusable components to scale sections.
- Performance polish (images, payload, micro-interactions).`,
        },
      },
      {
        title: { es: "resultado", en: "result" },
        body: {
          es: "Una web más simple y sólida: mejor jerarquía, mejor lectura y una base técnica lista para crecer.",
          en: "A simpler, sturdier website: clearer hierarchy, better reading flow and a technical base ready to grow.",
        },
      },
    ],
  },
  {
    slug: "",
    title: "promptea.me",
    badge: {
      es: "software tool",
      en: "software tool",
    },
    summary: {
      es: "Un copiloto para analizar, mejorar y versionar prompts. Diseñado para iterar rápido, mantener consistencia y escribir con claridad.",
      en: "A copilot to analyze, improve and version prompts. Built for fast iteration, consistency and clear writing.",
    },
    year: CURRENT_YEAR,
    role: {
      es: "producto • ux/ui • frontend",
      en: "product • ux/ui • frontend",
    },
    readingTime: {
      es: "3 min",
      en: "3 min",
    },
    stack: ["next.js", "typescript", "tailwind", "motion"],
    liveUrl: "https://promptea.me",
    coverImage: "/work/promptea-cover.svg",
    sections: [
      {
        title: { es: "contexto", en: "context" },
        body: {
          es: `Los prompts se convirtieron en un activo: se prueban, se reescriben y se versionan. Promptea nace para capturar ese loop de iteración sin fricción.

El objetivo: que escribir prompts sea tan “dev-friendly” como versionar código.`,
          en: `Prompts became an asset: you test them, rewrite them and version them. Promptea was born to capture that iteration loop with minimal friction.

The goal: make prompt writing as dev-friendly as versioning code.`,
        },
      },
      {
        title: { es: "qué hicimos", en: "what we built" },
        body: {
          es: `- Un flujo simple: pegar prompt → analizar → sugerir mejoras → guardar versión.
- UI minimal (blanco + micro-contraste) para que el foco sea el texto.
- Componentes reutilizables para escalar a nuevas features.`,
          en: `- A simple flow: paste prompt → analyze → suggest improvements → save a version.
- Minimal UI (white + micro-contrast) so text stays in focus.
- Reusable components so the product can scale.`,
        },
      },
      {
        title: { es: "resultado", en: "result" },
        body: {
          es: "Una herramienta liviana y clara para iterar prompts sin perder el hilo. El sistema está pensado para sumar más análisis, plantillas y colaboración.",
          en: "A lightweight, clear tool to iterate on prompts without losing the thread. The system is ready for more analysis, templates and collaboration.",
        },
      },
    ],
  },

  // ——— placeholders for upcoming work tiles (you can replace later) ———
  {
    slug: "",
    title: "moonlight web design",
    badge: {
      es: "design subscription",
      en: "design subscription",
    },
    summary: {
      es: "Un servicio de diseño web por suscripción: rápido, pulido y pensado para convertir. Lanzamiento próximamente.",
      en: "A subscription web design service: fast, polished and built to convert. Launching soon.",
    },
    year: CURRENT_YEAR,
    role: {
      es: "dirección • diseño • sistema",
      en: "direction • design • system",
    },
    readingTime: { es: "2 min", en: "2 min" },
    stack: ["design system", "framer motion", "next.js"],
    coverImage: "/work/moonlight-cover.svg",
    sections: [
      {
        title: { es: "estado", en: "status" },
        body: {
          es: "En preparación. Estamos afinando el sistema, el flujo de entrega y los primeros templates.",
          en: "In progress. We’re refining the system, delivery flow and first templates.",
        },
      },
    ],
    comingSoon: true,
  },
  {
    slug: "",
    title: "eterlab studio",
    badge: { es: "web experience", en: "web experience" },
    summary: {
      es: "El sitio base de eterlab: tipografía grande, micro-interacciones y motion sutil para una estética etérea.",
      en: "The eterlab baseline site: big type, micro-interactions and subtle motion for an ethereal aesthetic.",
    },
    year: CURRENT_YEAR,
    role: { es: "diseño • frontend", en: "design • frontend" },
    readingTime: { es: "2 min", en: "2 min" },
    stack: ["next.js", "tailwind", "motion"],
    coverImage: "/work/eterlab-cover.svg",
    sections: [
      {
        title: { es: "idea", en: "idea" },
        body: {
          es: "Una landing modular con una identidad suave: blancos, sombras livianas y animaciones precisas.",
          en: "A modular landing with a soft identity: whites, lightweight shadows and precise animations.",
        },
      },
    ],
  },
  {
    slug: "",
    title: "prompt workflows",
    badge: { es: "ai tooling", en: "ai tooling" },
    summary: {
      es: "Exploraciones de UI para herramientas de escritura asistida y flujos de trabajo con IA.",
      en: "UI explorations for assisted writing tools and AI workflows.",
    },
    year: CURRENT_YEAR,
    role: { es: "concepto • prototipo", en: "concept • prototype" },
    readingTime: { es: "1 min", en: "1 min" },
    stack: ["motion", "prototyping"],
    coverImage: "/work/placeholder-cover.svg",
    sections: [
      {
        title: { es: "nota", en: "note" },
        body: {
          es: "Trabajo en progreso — este espacio se completa cuando el proyecto esté listo.",
          en: "Work in progress — this space will be filled once the project is ready.",
        },
      },
    ],
    comingSoon: true,
  },
];

/** Convenience export used by the homepage featured section. */
export const LATEST_WORK: Work = getWorkBySlug(LATEST_WORK_SLUG) ?? WORKS[0];

function normalizeSlug(slug: string) {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // ignore malformed URI sequences
  }

  return decoded
    .trim()
    .toLowerCase()
    .replace(/\./g, "-")
    .replace(/\s+/g, "-");
}

export function getWorkBySlug(slug: string): Work | undefined {
  const s = normalizeSlug(slug);
  return WORKS.find((w) => normalizeSlug(w.slug) === s);
}





