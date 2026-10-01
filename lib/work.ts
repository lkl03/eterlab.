import type { Lang } from "./i18n";

export type Localized<T = string> = Record<Lang, T>;

export type WorkSection = {
  title: Localized;
  body: Localized;
};

/** A screenshot shown inside a browser ("desktop") or phone ("mobile") frame. */
export type WorkMedia = {
  kind: "desktop" | "mobile";
  src: string;
  width: number;
  height: number;
  alt: Localized;
  caption?: Localized;
};

/** One numbered chapter of a full case study. */
export type CaseChapter = {
  kicker: Localized;
  /** Optional first line of the title, set in a lighter tone. */
  titleLead?: Localized;
  title: Localized;
  body: Localized;
  stats?: { value: string; label: Localized }[];
  features?: { label: Localized; text: Localized }[];
  /** Short pills under the body (e.g. "buscador", "filtros por línea"). */
  tags?: Localized[];
  media?: WorkMedia[];
  /** Old page → new page, shown side by side. */
  pairs?: { label?: Localized; before: WorkMedia; after: WorkMedia }[];
};

/**
 * Long-form case study. When a work has one, /work/[slug] renders the
 * chaptered layout instead of the short `sections` page.
 */
export type CaseStudy = {
  theme: "dark" | "light";
  /** Display face for headlines; omit to keep the site's own type. */
  displayFont?: "playfair";
  partnerLogo: { src: string; width: number; height: number; alt: string };
  kicker: Localized;
  /** Optional first line of the headline, set in a lighter tone. */
  headlineLead?: Localized;
  headline: Localized;
  intro: Localized;
  chapters: CaseChapter[];
  closing: Localized;
  thanks?: Localized;
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
  /**
   * Basename of the scroll-through capture of the live site, without
   * extension — `${preview}.webm` and `${preview}.mp4` must both exist.
   */
  preview?: string;
  /** First frame of `preview`; also used while the clip loads. */
  previewPoster?: string;
  sections: WorkSection[];
  caseStudy?: CaseStudy;
  /** Optional flag for not-yet-launched items */
  comingSoon?: boolean;
};

const CURRENT_YEAR = String(new Date().getFullYear());

/** The single project spotlighted right below the hero. */
export const SPOTLIGHT_WORK_SLUG = "jinetes";

/** Client work shown in the homepage grid, newest first. */
export const LATEST_WORK_SLUGS: string[] = [
  "bioprotece",
  "kivnon-sas",
  "warriors-sport-arg",
  "dvlegales",
  "bioprotece3d",
];

const JINETES_D = { width: 1600, height: 1000 };
const PHONE = { width: 520, height: 1125 };

export const WORKS: Work[] = [
  {
    slug: "jinetes",
    title: "JINETES",
    badge: {
      es: "sitio para cliente",
      en: "client website",
    },
    summary: {
      es: "Sitio web para JINETES, la agencia de publicidad argentina fundada por Salvador Posse y Joaquín Vázquez Blanco. Diseño y desarrollo a medida para llevar su identidad a la web, desde que entrás hasta que salís.",
      en: "Website for JINETES, the Argentine ad agency founded by Salvador Posse and Joaquín Vázquez Blanco. A custom design and build that carries their identity onto the web, from the moment you land until you leave.",
    },
    year: "2026",
    role: {
      es: "diseño • desarrollo • seo",
      en: "design • development • seo",
    },
    readingTime: { es: "4 min", en: "4 min" },
    stack: ["next.js", "typescript", "tailwind", "video on demand", "i18n", "seo + geo"],
    liveUrl: "https://jinetes.agency",
    coverImage: "/work/previews/jinetes-poster.jpg",
    preview: "/work/previews/jinetes",
    previewPoster: "/work/previews/jinetes-poster.jpg",
    sections: [],
    caseStudy: {
      theme: "dark",
      displayFont: "playfair",
      partnerLogo: { src: "/work/jinetes/logo-white.webp", width: 475, height: 480, alt: "JINETES" },
      kicker: { es: "case study — sitio web", en: "case study — website" },
      headline: {
        es: "Una agencia rebelde, un sitio disruptivo.",
        en: "A rebel agency, a disruptive site.",
      },
      intro: {
        es: "Diseñamos y desarrollamos jinetes.agency, el sitio de JINETES: un mismo paisaje de punta a punta, las campañas en video listas para ver, pensado para cada dispositivo y con todo lo que no se ve funcionando atrás.",
        en: "We designed and built jinetes.agency, the home of JINETES: one landscape from end to end, the agency's campaigns ready to play, made for every device and with everything you don't see working behind the scenes.",
      },
      chapters: [
        {
          kicker: { es: "punto de partida", en: "starting point" },
          title: { es: "Nuestra misión.", en: "Our mission." },
          body: {
            es: "Llevar la esencia de JINETES a la web, respetando su imagen y su tono en cada rincón del sitio. Desde que entrás hasta que salís.",
            en: "Bring the essence of JINETES to the web, honoring their image and tone in every corner of the site. From the moment you land until you leave.",
          },
          media: [
            {
              kind: "desktop",
              src: "/work/jinetes/d-services.webp",
              ...JINETES_D,
              alt: { es: "Sección Qué hacemos", en: "What we do section" },
              caption: { es: "Qué hacemos: la agencia contada en su propio tono.", en: "What we do: the agency, told in its own voice." },
            },
          ],
        },
        {
          kicker: { es: "background & details", en: "background & details" },
          title: { es: "Un mismo paisaje.", en: "One landscape." },
          body: {
            es: "Todo el sitio vive sobre un paisaje fijo, y cada sección se apoya encima sin taparlo. Al bajar no cambia la página: cambia la luz, hasta un negro sólido en la sección de trabajos.",
            en: "The whole site lives on a single fixed landscape, and every section rests on top without covering it. Scrolling doesn't change the page: it changes the light, down to solid black in the work section.",
          },
          media: [
            {
              kind: "desktop",
              src: "/work/jinetes/d-about.webp",
              ...JINETES_D,
              alt: { es: "Sección Nosotros", en: "About section" },
              caption: { es: "El grabado del manual, a pantalla completa.", en: "The brand-book engraving, full screen." },
            },
            {
              kind: "desktop",
              src: "/work/jinetes/d-work.webp",
              ...JINETES_D,
              alt: { es: "Sección Trabajos", en: "Work section" },
              caption: { es: "Mismo paisaje, otra luz: trabajos, sobre negro sólido.", en: "Same landscape, different light: work, on solid black." },
            },
          ],
        },
        {
          kicker: { es: "las campañas", en: "the campaigns" },
          title: { es: "Una videoteca propia.", en: "A video library of its own." },
          body: {
            es: "Las campañas de JINETES se ven directo en el sitio. Los videos cargan bajo demanda, recién cuando alguien los quiere ver, y en la calidad justa para cada pantalla y conexión.",
            en: "JINETES' campaigns play right on the site. Videos load on demand, only when someone wants to watch them, and at the right quality for every screen and connection.",
          },
          stats: [
            { value: "09", label: { es: "marcas", en: "brands" } },
            { value: "56", label: { es: "films", en: "films" } },
          ],
          media: [
            {
              kind: "desktop",
              src: "/work/jinetes/d-mananita.webp",
              ...JINETES_D,
              alt: { es: "Página de la campaña Mañanita", en: "Mañanita campaign page" },
              caption: { es: "Cada campaña con su propia página.", en: "Every campaign gets its own page." },
            },
            {
              kind: "desktop",
              src: "/work/jinetes/d-campanas-row.webp",
              ...JINETES_D,
              alt: { es: "Listado de campañas", en: "Campaign index" },
              caption: { es: "/campañas: todas las marcas, con sus films a un clic.", en: "/campaigns: every brand, its films one click away." },
            },
          ],
        },
        {
          kicker: { es: "en cada dispositivo", en: "on every device" },
          title: { es: "Pensado para cada pantalla.", en: "Made for every screen." },
          body: {
            es: "Del celular al escritorio, cada vista tiene su propio diseño: menú, campañas, videos y formularios optimizados para cada dispositivo.",
            en: "From phone to desktop, every view has its own design: menu, campaigns, videos and forms tuned for each device.",
          },
          media: [
            { kind: "mobile", src: "/work/jinetes/m-hero.webp", ...PHONE, alt: { es: "Home en el celular", en: "Home on mobile" } },
            { kind: "mobile", src: "/work/jinetes/m-work.webp", ...PHONE, alt: { es: "Trabajos en el celular", en: "Work on mobile" } },
            { kind: "mobile", src: "/work/jinetes/m-campanas.webp", ...PHONE, alt: { es: "Campañas en el celular", en: "Campaigns on mobile" } },
            { kind: "mobile", src: "/work/jinetes/m-mananita.webp", ...PHONE, alt: { es: "Una campaña en el celular", en: "A campaign on mobile" } },
          ],
        },
        {
          kicker: { es: "lo que no se ve", en: "what you don't see" },
          title: { es: "Detrás del diseño.", en: "Behind the design." },
          body: {
            es: "Lo que hace que el sitio funcione todos los días, sin que nadie lo note.",
            en: "What keeps the site working every day, without anyone noticing.",
          },
          features: [
            {
              label: { es: "ES / EN", en: "ES / EN" },
              text: { es: "Todo el sitio en español e inglés, con un toggle de idioma.", en: "The whole site in Spanish and English, with a language toggle." },
            },
            {
              label: { es: "Formularios", en: "Forms" },
              text: { es: "Consultas y CVs llegan directo a la agencia.", en: "Enquiries and CVs land straight in the agency's inbox." },
            },
            {
              label: { es: "Repercusión", en: "Press" },
              text: { es: "Los posts reales de X e Instagram, embebidos, junto a la prensa.", en: "Real posts from X and Instagram, embedded next to the press coverage." },
            },
            {
              label: { es: "SEO + GEO", en: "SEO + GEO" },
              text: { es: "Optimizado para Google y para los buscadores con IA, con las prácticas más actuales.", en: "Optimized for Google and for AI search engines, following current best practices." },
            },
            {
              label: { es: "QA", en: "QA" },
              text: { es: "Controles automáticos que revisan el sitio en vivo.", en: "Automated checks that keep watching the live site." },
            },
          ],
          media: [
            {
              kind: "desktop",
              src: "/work/jinetes/d-repercusion.webp",
              ...JINETES_D,
              alt: { es: "Sección Repercusión", en: "Press section" },
              caption: { es: "Repercusión: lo que se dijo de la agencia, en vivo.", en: "Press: what people said about the agency, live." },
            },
          ],
        },
      ],
      closing: {
        es: "Un sitio que no pasa desapercibido, para una agencia que tampoco.",
        en: "A site that doesn't go unnoticed, for an agency that doesn't either.",
      },
      thanks: {
        es: "Gracias Salvador y Joaquín por la confianza.",
        en: "Thank you Salvador and Joaquín for the trust.",
      },
    },
  },
  {
    slug: "bioprotece",
    title: "Bioprotece S.A.",
    badge: {
      es: "rebranding + dashboard",
      en: "rebranding + dashboard",
    },
    summary: {
      es: "Rebranding y nuevo dashboard para Bioprotece S.A., empresa líder en fabricación de implantes médicos. De un sitio de plantilla a uno a medida: catálogo con buscador, implantes a medida, certificaciones y un panel propio para el equipo.",
      en: "Rebranding and a new dashboard for Bioprotece S.A., a leading medical-implant manufacturer. From a template site to a custom one: a searchable catalog, custom implants, certifications and an in-house panel for the team.",
    },
    year: "2026",
    role: {
      es: "diseño • desarrollo • dashboard",
      en: "design • development • dashboard",
    },
    readingTime: { es: "3 min", en: "3 min" },
    stack: ["next.js", "typescript", "tailwind", "firebase", "i18n", "seo + geo"],
    liveUrl: "https://www.bioprotece.com.ar",
    coverImage: "/work/previews/bioprotece-poster.jpg",
    preview: "/work/previews/bioprotece",
    previewPoster: "/work/previews/bioprotece-poster.jpg",
    sections: [],
    caseStudy: {
      theme: "light",
      partnerLogo: { src: "/work/bioprotece/logo.webp", width: 363, height: 102, alt: "Bioprotece S.A." },
      kicker: { es: "case study — sitio web + dashboard", en: "case study — website + dashboard" },
      headlineLead: { es: "Bioprotece S.A.", en: "Bioprotece S.A." },
      headline: {
        es: "rebranding\u00a0+ nuevo dashboard.",
        en: "rebranding\u00a0+ a new dashboard.",
      },
      intro: {
        es: "Case study y work showcase del rediseño integral que hicimos para Bioprotece, empresa líder en fabricación de implantes médicos.",
        en: "Case study and work showcase of the end-to-end redesign we did for Bioprotece, a leading medical-implant manufacturer.",
      },
      chapters: [
        {
          kicker: { es: "antes → después", en: "before → after" },
          titleLead: { es: "punto de partida:", en: "starting point:" },
          title: { es: "el nuevo sitio, hecho a medida.", en: "the new site, built to measure." },
          body: {
            es: "El sitio anterior era de plantilla: reunía el catálogo y la información de la empresa, pero sin un diseño a la altura de lo que fabrica Bioprotece. El nuevo tiene un mensaje claro desde el inicio, un catálogo con buscador y filtros por línea, y una página de implantes a medida que explica el proceso paso a paso.",
            en: "The previous site was a template: it held the catalog and company information, but its design wasn't up to the standard of what Bioprotece manufactures. The new one has a clear message from the start, a catalog with search and filters by product line, and a custom-implants page that explains the process step by step.",
          },
          tags: [
            { es: "buscador", en: "search" },
            { es: "filtros por línea", en: "filters by line" },
            { es: "fichas con medidas", en: "spec sheets with sizes" },
            { es: "certificaciones", en: "certifications" },
            { es: "celular y escritorio", en: "mobile and desktop" },
          ],
          pairs: [
            {
              label: { es: "inicio", en: "home" },
              before: { kind: "desktop", src: "/work/bioprotece/antes-home.webp", width: 1600, height: 805, alt: { es: "Inicio, sitio anterior", en: "Home, previous site" } },
              after: { kind: "desktop", src: "/work/bioprotece/d-home.webp", width: 1600, height: 829, alt: { es: "Inicio, sitio nuevo", en: "Home, new site" } },
            },
            {
              label: { es: "catálogo", en: "catalog" },
              before: { kind: "desktop", src: "/work/bioprotece/antes-productos.webp", width: 1600, height: 802, alt: { es: "Catálogo, sitio anterior", en: "Catalog, previous site" } },
              after: { kind: "desktop", src: "/work/bioprotece/d-productos.webp", width: 1600, height: 829, alt: { es: "Catálogo, sitio nuevo", en: "Catalog, new site" } },
            },
            {
              label: { es: "implantes a medida", en: "custom implants" },
              before: { kind: "desktop", src: "/work/bioprotece/antes-implantes.webp", width: 1600, height: 803, alt: { es: "Implantes a medida, sitio anterior", en: "Custom implants, previous site" } },
              after: { kind: "desktop", src: "/work/bioprotece/d-implantes.webp", width: 1600, height: 829, alt: { es: "Implantes a medida, sitio nuevo", en: "Custom implants, new site" } },
            },
          ],
        },
        {
          kicker: { es: "el catálogo", en: "the catalog" },
          titleLead: { es: "todo el catálogo,", en: "the whole catalog," },
          title: { es: "en el sitio nuevo.", en: "on the new site." },
          body: {
            es: "Todo el catálogo pasó al sitio nuevo con sus fotos y medidas, y las direcciones anteriores redirigen a las nuevas para no perder posicionamiento.",
            en: "The whole catalog moved to the new site with its photos and sizes, and the old URLs redirect to the new ones so search rankings aren't lost.",
          },
          stats: [
            { value: "70", label: { es: "productos migrados", en: "products migrated" } },
            { value: "10", label: { es: "líneas de producto", en: "product lines" } },
          ],
          media: [
            {
              kind: "desktop",
              src: "/work/bioprotece/d-lineas.webp",
              width: 1600,
              height: 1000,
              alt: { es: "Líneas de producto", en: "Product lines" },
              caption: { es: "Las diez líneas, de un vistazo.", en: "All ten product lines at a glance." },
            },
            {
              kind: "desktop",
              src: "/work/bioprotece/d-ficha.webp",
              width: 1600,
              height: 1000,
              alt: { es: "Ficha de producto", en: "Product page" },
              caption: { es: "Cada producto con su ficha y medidas.", en: "Every product with its own spec sheet." },
            },
          ],
        },
        {
          kicker: { es: "en cada dispositivo", en: "on every device" },
          titleLead: { es: "celular y escritorio,", en: "mobile and desktop," },
          title: { es: "pensado para cada pantalla.", en: "made for every screen." },
          body: {
            es: "Catálogo, fichas, implantes a medida y documentación resueltos para cada pantalla, en español e inglés.",
            en: "Catalog, product pages, custom implants and documentation, each designed for every screen, in Spanish and English.",
          },
          media: [
            { kind: "mobile", src: "/work/bioprotece/m-home.webp", ...PHONE, alt: { es: "Inicio en el celular", en: "Home on mobile" } },
            { kind: "mobile", src: "/work/bioprotece/m-productos.webp", ...PHONE, alt: { es: "Catálogo en el celular", en: "Catalog on mobile" } },
            { kind: "mobile", src: "/work/bioprotece/m-ficha.webp", ...PHONE, alt: { es: "Ficha en el celular", en: "Product page on mobile" } },
            { kind: "mobile", src: "/work/bioprotece/m-implantes.webp", ...PHONE, alt: { es: "Implantes a medida en el celular", en: "Custom implants on mobile" } },
          ],
        },
        {
          kicker: { es: "lo que no se ve", en: "what you don't see" },
          titleLead: { es: "detrás del sitio,", en: "behind the site," },
          title: { es: "un dashboard propio.", en: "a dashboard of its own." },
          body: {
            es: "Un panel de gestión para que el equipo de Bioprotece cargue y actualice productos, fotos, medidas y documentación por su cuenta, sin tocar código.",
            en: "An admin panel so the Bioprotece team can add and update products, photos, sizes and documents on their own, without touching code.",
          },
          features: [
            {
              label: { es: "Productos", en: "Products" },
              text: { es: "Alta y edición con fotos, portada y tablas de medidas por variante. Se publican al instante.", en: "Create and edit with photos, cover and per-variant size tables. Published instantly." },
            },
            {
              label: { es: "Documentos", en: "Documents" },
              text: { es: "Certificaciones ordenadas por carpeta, con visor en la página y descarga en PDF.", en: "Certifications organized in folders, with an in-page viewer and PDF download." },
            },
            {
              label: { es: "Usuarios", en: "Users" },
              text: { es: "Cada persona con su rol y verificación en dos pasos.", en: "Every person with their own role and two-step verification." },
            },
            {
              label: { es: "Contacto", en: "Contact" },
              text: { es: "Cada ficha consulta directo a ventas, con el producto en el asunto.", en: "Every product page enquires straight to sales, with the product in the subject line." },
            },
            {
              label: { es: "ES / EN", en: "ES / EN" },
              text: { es: "Todo el sitio en español e inglés.", en: "The whole site in Spanish and English." },
            },
            {
              label: { es: "SEO + GEO", en: "SEO + GEO" },
              text: { es: "Optimizado para Google y para los buscadores con IA.", en: "Optimized for Google and for AI search engines." },
            },
          ],
          media: [
            {
              kind: "desktop",
              src: "/work/bioprotece/d-documentacion.webp",
              width: 1600,
              height: 1000,
              alt: { es: "Documentación descargable", en: "Downloadable documentation" },
              caption: { es: "Certificaciones, siempre al día y en PDF.", en: "Certifications, always current and in PDF." },
            },
          ],
        },
      ],
      closing: {
        es: "Un sitio a la altura de 26 años de trayectoria.",
        en: "A website worthy of 26 years in the field.",
      },
      thanks: {
        es: "Gracias al equipo de Bioprotece por la confianza.",
        en: "Thank you to the Bioprotece team for the trust.",
      },
    },
  },
  {
    slug: "kivnon-sas",
    title: "KIVNON SAS",
    badge: {
      es: "sitio para cliente",
      en: "client website",
    },
    summary: {
      es: "Web institucional para KIVNON SAS — división de I+D de Milfarma dedicada a implantes personalizados. Diseño y desarrollo bilingüe con foco en respaldo técnico, claridad clínica y captación de consultas.",
      en: "Institutional website for KIVNON SAS — Milfarma's R&D division for custom implants. Bilingual design and build focused on technical authority, clinical clarity and inbound consultations.",
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
    stack: ["next.js", "typescript", "tailwind", "i18n", "seo"],
    liveUrl: "https://www.kivnonsas.com.ar",
    coverImage: "/work/previews/kivnon-sas-poster.jpg",
    preview: "/work/previews/kivnon-sas",
    previewPoster: "/work/previews/kivnon-sas-poster.jpg",
    sections: [
      {
        title: { es: "contexto", en: "context" },
        body: {
          es: `KIVNON SAS es la división de I+D de Milfarma SAS: bioingeniería médica aplicada a implantes personalizados para casos complejos — craneoplastías, columna, espaciadores de PMMA y endoprótesis temporales de rodilla, cadera y hombro.

Su público no es masivo: son cirujanos, instituciones y distribuidores que necesitan entender rápido el proceso, la validación médica y las capacidades de fabricación antes de acercar un caso. La web tenía que sostener ese nivel de exigencia técnica sin volverse un catálogo frío.`,
          en: `KIVNON SAS is the R&D division of Milfarma SAS: medical bioengineering applied to custom implants for complex cases — cranioplasty, spine, PMMA spacers and temporary knee, hip and shoulder endoprostheses.

Their audience isn't mass market: surgeons, institutions and distributors who need to quickly grasp the process, the medical validation and the manufacturing capabilities before bringing in a case. The site had to hold that level of technical rigor without turning into a cold catalog.`,
        },
      },
      {
        title: { es: "qué hicimos", en: "what we built" },
        body: {
          es: `- Sitio bilingüe ES/EN resuelto del lado del cliente, sin duplicar URLs ni fragmentar el SEO.
- Narrativa del proceso completo: diseño sobre la anatomía del caso, validación con el profesional tratante, manufactura aditiva y acompañamiento hasta la asistencia en quirófano.
- Sistema visual medtech — azul institucional con acento teal, jerarquía tipográfica firme y motion medido — que transmite precisión sin enfriar la lectura.
- Bento de capacidades con lightbox y tiras "del defecto a la placa" para mostrar casos reales paso a paso.
- Curaduría de material clínico con criterio de privacidad: cada imagen se revisa antes de publicarse y se importa despersonalizada.
- Formulario de consulta verificado punta a punta, WhatsApp flotante hacia la línea que realmente atiende, y base técnica de SEO (metadata, JSON-LD de organización médica, sitemap y canónicas sobre el dominio productivo).`,
          en: `- Bilingual ES/EN site resolved client-side, without duplicating URLs or fragmenting SEO.
- The full process as narrative: design over each case's anatomy, validation with the treating physician, additive manufacturing and support all the way into the operating room.
- A medtech visual system — institutional blue with a teal accent, firm typographic hierarchy and measured motion — that reads precise without going cold.
- A capabilities bento with lightbox plus "from defect to plate" strips that walk through real cases step by step.
- Clinical material curated for privacy: every image is reviewed before publishing and imported de-identified.
- An enquiry form verified end to end, a floating WhatsApp CTA pointing at the line that actually answers, and a technical SEO baseline (metadata, medical-organization JSON-LD, sitemap and canonicals on the production domain).`,
        },
      },
      {
        title: { es: "resultado", en: "result" },
        body: {
          es: "Una web que ordena un servicio difícil de explicar y lo vuelve consultable: el profesional entiende el proceso, ve casos reales y tiene un camino claro para acercar el suyo. Online en su dominio propio, bilingüe y lista para escalar a nuevas líneas.",
          en: "A site that structures a service that's hard to explain and makes it approachable: professionals understand the process, see real cases and have a clear path to bring in their own. Live on its own domain, bilingual and ready to scale to new product lines.",
        },
      },
    ],
  },
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
    preview: "/work/previews/dvlegales",
    previewPoster: "/work/previews/dvlegales-poster.jpg",
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
    preview: "/work/previews/warriors-sport-arg",
    previewPoster: "/work/previews/warriors-sport-arg-poster.jpg",
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
    preview: "/work/previews/bioprotece3d",
    previewPoster: "/work/previews/bioprotece3d-poster.jpg",
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

function resolveSlugs(slugs: string[]): Work[] {
  return slugs.map((slug) => getWorkBySlug(slug)).filter((w): w is Work => Boolean(w));
}

/** The project spotlighted right below the hero. */
export const SPOTLIGHT_WORK: Work = getWorkBySlug(SPOTLIGHT_WORK_SLUG) ?? WORKS[0];

/** Client work for the homepage grid (excludes the spotlight). */
export const LATEST_WORKS: Work[] = resolveSlugs(LATEST_WORK_SLUGS);

/** Every client case study, spotlight first — used by /work and "next project". */
export const CLIENT_WORKS: Work[] = [SPOTLIGHT_WORK, ...LATEST_WORKS.filter((w) => w.slug !== SPOTLIGHT_WORK.slug)];

/** The case study that follows `slug` in CLIENT_WORKS (wraps around). */
export function getNextWork(slug: string): Work | undefined {
  const i = CLIENT_WORKS.findIndex((w) => w.slug === slug);
  if (i === -1 || CLIENT_WORKS.length < 2) return undefined;
  return CLIENT_WORKS[(i + 1) % CLIENT_WORKS.length];
}

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





