import type { MetadataRoute } from "next";
import { SITE_URL as siteUrl } from "../lib/site";

// Private routes. /admin also sends `noindex, nofollow` from its own metadata.
// /_next/ is deliberately NOT blocked: it serves the CSS/JS Google needs to
// render the pages and every next/image URL (/_next/image?url=…).
const DISALLOW = ["/api/", "/admin"];

// AI crawlers and assistants we want to read the public site. A bot that
// matches its own group ignores the `*` group, so each group repeats DISALLOW.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
