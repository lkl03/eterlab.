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
export const LATEST_WORK_SLUG = "dvlegales";

/**
 * Slugs that should render as large hero slides in the featured slideshow
 * on the homepage (desktop). Order here controls the slideshow order.
 */
export const FEATURED_SLIDESHOW_SLUGS: string[] = ["dvlegales", "warriors-sport-arg", "bioprotece3d"];

export const WORKS: Work[] = [
  {
    slug: "dvlegales",
    title: "DV Legales",
    badge: {
      es: "sitio para cliente",
      en: "client website",
    },
    summary: {
      es: "Nueva web para DV Legales — estudio jurídico con foco en asesoramiento claro, estratégico y humano. Rediseño y desarrollo priorizando claridad, confianza y performance.",
      en: "New website for DV Legales — a law firm focused on clear, strategic and human legal counsel. Redesign + build prioritizing clarity, trust and performance.",
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
    liveUrl: "https://dvlegales.com.ar",
    coverByLang: {
      es: "/work/dvlegales-cover-es.jpg",
      en: "/work/dvlegales-cover-en.jpg",
    },
    coverImage: "/work/dvlegales-cover.jpg",
    sections: [
      {
        title: { es: "contexto", en: "context" },
        body: {
          es: `DV Legales es un estudio jurídico que acompaña a personas, empresas y organizaciones en decisiones sensibles: desde asesoramiento tributario y laboral hasta procesos de familia, daños y penal.

Necesitaban una web que transmitiera respaldo técnico y cercanía a la vez — sin la frialdad del típico sitio de estudio jurídico, pero con toda la solidez que el rubro exige.`,
          en: `DV Legales is a law firm that guides individuals, companies and organizations through sensitive decisions: from tax and labor advisory to family, damages and criminal matters.

They needed a website that conveyed both technical authority and a human, approachable tone — without the coldness typical of law-firm sites, but with all the solidity the industry demands.`,
        },
      },
      {
        title: { es: "qué hicimos", en: "what we built" },
        body: {
          es: `- Arquitectura de información clara: inicio, estudio, servicios, equipo y contacto, con un flujo pensado para que el visitante entienda rápido qué hace el estudio y cómo trabajan.
- Sección de áreas de práctica modular (tributario, laboral empresarial, comercial y societario, penal, familia y sucesiones, daños) con un patrón reutilizable para sumar nuevas áreas sin rediseñar.
- Sistema visual sobrio — tipografía con jerarquía fuerte, paleta calma y micro-interacciones medidas — para transmitir seriedad sin ser aburrido.
- CTA de “solicitar consulta” presentes en los puntos de decisión, sin saturar.
- Performance y SEO técnico como base: imágenes optimizadas, metadata por sección y tiempos de carga cuidados.`,
          en: `- Clear information architecture: home, firm, services, team and contact, with a flow designed so visitors quickly grasp what the firm does and how they work.
- Modular practice-area section (tax, corporate labor, commercial and corporate, criminal, family and probate, damages) built as a reusable pattern so new areas can be added without a redesign.
- A sober visual system — strong typographic hierarchy, calm palette and measured micro-interactions — conveying seriousness without being dull.
- "Request a consultation" CTAs placed at decision points, without clutter.
- Performance and technical SEO as the baseline: optimized images, per-section metadata and careful load times.`,
        },
      },
      {
        title: { es: "resultado", en: "result" },
        body: {
          es: "Una web que se siente como el estudio: profesional, ordenada y humana. La página comunica el valor del servicio antes del primer contacto y funciona como un canal real de captación de consultas.",
          en: "A site that feels like the firm itself: professional, structured and human. It communicates the value of the service before the first contact and works as a real channel for inbound consultations.",
        },
      },
    ],
  },
  {
    slug: "warriors-sport-arg",
    title: "Warriors Sport Arg",
    badge: {
      es: "sitio para cliente",
      en: "client website",
    },
    summary: {
      es: "Nueva web para Warriors Sport Arg — gimnasio con varias sedes. Diseño y desarrollo con foco en horarios claros, sedes y captación de nuevos socios.",
      en: "New website for Warriors Sport Arg — a multi-location gym. Design and build focused on clear schedules, locations and new-member acquisition.",
    },
    year: "2026",
    role: {
      es: "diseño • frontend",
      en: "design • frontend",
    },
    readingTime: {
      es: "2 min",
      en: "2 min",
    },
    stack: ["next.js", "typescript", "tailwind", "motion"],
    liveUrl: "https://warriorssportarg.com.ar",
    coverImage: "/work/warriors-sport-arg-cover.jpg",
    sections: [
      {
        title: { es: "contexto", en: "context" },
        body: {
          es: `Warriors Sport Arg es un gimnasio con varias sedes y una comunidad fuerte. Su presencia online no acompañaba esa energía: la información de horarios y sedes estaba dispersa y no había un camino claro para sumarse.

Necesitaban una web que transmitiera intensidad y pertenencia, y que al mismo tiempo resolviera lo práctico en pocos clics.`,
          en: `Warriors Sport Arg is a multi-location gym with a strong community. Their online presence didn't match that energy: schedules and location info were scattered and there was no clear path to sign up.

They needed a site that conveyed intensity and belonging while solving the practical questions in a couple of clicks.`,
        },
      },
      {
        title: { es: "qué hicimos", en: "what we built" },
        body: {
          es: `- Home con slideshow a pantalla completa mostrando las instalaciones reales.
- Secciones de horarios y sedes con estructura clara y fácil de actualizar.
- Identidad visual oscura con acento verde, alineada a la marca.
- CTA de contacto directo por WhatsApp siempre a mano.`,
          en: `- Full-screen hero slideshow showcasing the real facilities.
- Schedule and location sections with a clear, easy-to-update structure.
- Dark visual identity with a green accent, aligned with the brand.
- Direct WhatsApp contact CTA always within reach.`,
        },
      },
      {
        title: { es: "resultado", en: "result" },
        body: {
          es: "Una web que se siente como el gimnasio: intensa, clara y directa. El visitante entiende dónde entrenar, a qué hora y cómo empezar.",
          en: "A site that feels like the gym: intense, clear and direct. Visitors instantly know where to train, at what time and how to start.",
        },
      },
    ],
  },
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
    title: "moonlight web designs",
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

/**
 * Ordered list of works that render as large hero slides in the homepage
 * slideshow. Falls back to [LATEST_WORK] if none of the curated slugs resolve.
 */
export const FEATURED_SLIDESHOW_WORKS: Work[] = (() => {
  const resolved = FEATURED_SLIDESHOW_SLUGS
    .map((slug) => getWorkBySlug(slug))
    .filter((w): w is Work => Boolean(w));
  return resolved.length > 0 ? resolved : [LATEST_WORK];
})();

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





