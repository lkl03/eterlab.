// schema.org JSON-LD for the public pages. Only facts already published on
// the site go here (name, contact, profiles, cases) — no address, ratings,
// founding date or client claims that the site itself does not state.
import { COPY } from "./i18n";
import { SITE, SITE_DESCRIPTION, SITE_URL } from "./site";
import type { Work } from "./work";

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const footer = COPY.es.footer;

/** Public profiles linked from the footer (placeholders like "#" are skipped). */
const SAME_AS = [footer.social.instagram, footer.social.linkedin, footer.social.tiktok].filter((u) =>
  /^https?:\/\//.test(u)
);

/** "+54 9 11 7136-2144" → "+5491171362144" */
const TELEPHONE = footer.whatsappNumber.replace(/[^\d+]/g, "");

function abs(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "eterlab.",
    alternateName: "eterlab",
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: abs("/logo.avif"), width: 378, height: 123 },
    image: abs("/og.png"),
    description: SITE_DESCRIPTION,
    slogan: COPY.es.hero.subtitle,
    email: SITE.email,
    telephone: TELEPHONE,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: TELEPHONE,
      availableLanguage: ["es", "en"],
    },
    sameAs: SAME_AS,
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "eterlab.",
    inLanguage: "es",
    publisher: { "@id": ORG_ID },
  };
}

export function workJsonLd(work: Work): JsonLd[] {
  const url = `${SITE_URL}/work/${work.slug}`;
  const cover = work.previewPoster ?? work.coverImage;
  const image = cover && !cover.toLowerCase().endsWith(".svg") ? abs(cover) : undefined;

  const creativeWork: JsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    url,
    name: work.title,
    headline: `${work.title}: caso de diseño y desarrollo web`,
    description: work.summary.es,
    inLanguage: "es",
    dateCreated: work.year,
    ...(work.updatedAt ? { dateModified: work.updatedAt } : {}),
    ...(image ? { image } : {}),
    keywords: work.stack.join(", "),
    creator: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
    // The client the site was built for, and the live result.
    about: {
      "@type": "Organization",
      name: work.title,
      ...(work.liveUrl ? { url: work.liveUrl } : {}),
    },
  };

  const breadcrumbs: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Trabajos", item: `${SITE_URL}/work` },
      { "@type": "ListItem", position: 3, name: work.title, item: url },
    ],
  };

  return [creativeWork, breadcrumbs];
}
