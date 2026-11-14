import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../lib/site";
import { JsonLd } from "../components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "../lib/structured-data";

const karla = Karla({
  subsets: ["latin"],
  // Include 300 so `font-light` is actually light (used in the hero subtitle).
  weight: ["300", "400", "600"],
  display: "swap",
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



