import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
  // Include 300 so `font-light` is actually light (used in the hero subtitle).
  weight: ["300", "400", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eterlab.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "eterlab.",
    template: "%s – eterlab.",
  },
  description: "Design & development studio — turning ideas into useful digital products.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "eterlab.",
    title: "eterlab.",
    description: "Design & development studio — turning ideas into useful digital products.",
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
    title: "eterlab.",
    description: "Design & development studio — turning ideas into useful digital products.",
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
        {children}
      </body>
    </html>
  );
}



