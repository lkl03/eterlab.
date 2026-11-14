// /llms.txt — a plain-text map of the site for AI assistants (llmstxt.org).
// Built from the same data the pages render, so it can't drift from them.
// Only facts published on the site; nothing about team size, prices or
// results that the site doesn't state.
import { COPY } from "../../lib/i18n";
import { SITE, SITE_URL } from "../../lib/site";
import { CLIENT_WORKS } from "../../lib/work";

export const dynamic = "force-static";

const es = COPY.es;

// Same products and URLs as the "proyectos." section on the home page.
const PRODUCTS = [
  { name: "promptea.me", url: "https://promptea.me", badge: es.projects.cards.promptea.badge, desc: es.projects.cards.promptea.desc },
  { name: "moonlight web designs", url: "https://moonlightwebdesigns.com/", badge: es.projects.cards.moonlight.badge, desc: es.projects.cards.moonlight.desc },
  { name: "nodo", url: "https://nodoar.app", badge: es.projects.cards.nodo.badge, desc: es.projects.cards.nodo.desc },
];

function build(): string {
  const social = es.footer.social;
  const lines: string[] = [
    "# eterlab.",
    "",
    `> eterlab. es un estudio de diseño y desarrollo web con base en ${es.footer.location}: ${es.hero.subtitle} Sitio oficial: ${SITE_URL}`,
    "",
    `${es.statement.descStrong} ${es.statement.desc.replace(/\s+/g, " ").trim()}`,
    "",
    "## Casos de clientes",
    "",
    ...CLIENT_WORKS.map((w) => {
      const live = w.liveUrl ? ` Sitio: ${w.liveUrl}` : "";
      return `- [${w.title}](${SITE_URL}/work/${w.slug}): ${w.summary.es} (${w.year}; ${w.role.es}).${live}`;
    }),
    "",
    "## Productos propios",
    "",
    ...PRODUCTS.map((p) => `- [${p.name}](${p.url}): ${p.badge}. ${p.desc}`),
    "",
    "## Contacto",
    "",
    `- Email: ${SITE.email}`,
    `- WhatsApp: ${es.footer.whatsappNumber} (${social.whatsapp})`,
    `- Formulario: ${SITE_URL}/#contact`,
    "",
    "## Perfiles",
    "",
    `- Instagram: ${social.instagram}`,
    `- LinkedIn: ${social.linkedin}`,
    `- TikTok: ${social.tiktok}`,
    "",
    "## Páginas",
    "",
    `- [Inicio](${SITE_URL}/)`,
    `- [Trabajos](${SITE_URL}/work)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ];
  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
