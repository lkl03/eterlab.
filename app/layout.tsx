import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/site";
import { JsonLd } from "../components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "../lib/structured-data";

// Karla, self-hosted: the same variable latin file Google Fonts serves
// (fonts.gstatic.com/s/karla/v33), SIL OFL 1.1 (app/fonts/Karla-OFL.txt).
// next/font/google broke the Vercel build when Google answered with
// "/l/font?kit=…&skey=…" URLs, which Turbopack in Next 16.1.6 can't parse.
// The file covers weights 200–800, so `font-light` (300) still works.
const karla = localFont({
  src: "./fonts/Karla-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s – eterlab.",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "eterlab.",
    locale: "es_AR",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "eterlab.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${karla.className} bg-paper text-ink antialiased`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}



