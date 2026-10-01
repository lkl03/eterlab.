import type { MetadataRoute } from "next";
import { WORKS } from "../lib/work";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eterlab.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Placeholder entries have no slug and no page of their own.
    ...WORKS.filter((w) => w.slug).map((w) => ({
      url: `${siteUrl}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
