import type { MetadataRoute } from "next";
import { CLIENT_WORKS, WORKS, type Work } from "../lib/work";
import { SITE_URL as siteUrl } from "../lib/site";

// Placeholder entries have no slug and no page of their own.
const CASES = WORKS.filter((w) => w.slug);

/** Real content date when the case declares one; build time otherwise. */
function lastModified(w: Work): Date {
  return w.updatedAt ? new Date(`${w.updatedAt}T00:00:00Z`) : new Date();
}

function latest(dates: Date[]): Date {
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default function sitemap(): MetadataRoute.Sitemap {
  // The home and /work list the client cases, so they change when a case does.
  const listed = latest(CLIENT_WORKS.map(lastModified));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: listed,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: listed,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CASES.map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      lastModified: lastModified(w),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
