import type { Metadata } from "next";
import { CLIENT_WORKS } from "../../lib/work";

// The root layout's template appends " – eterlab.", so the title here is bare.
const TITLE = "Trabajos: casos de diseño y desarrollo web";

const names = CLIENT_WORKS.map((w) => w.title);
const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}` : names.join("");
const DESCRIPTION = `Casos de diseño y desarrollo web de eterlab.: ${list}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    type: "website",
    url: "/work",
    title: `${TITLE} – eterlab.`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "eterlab.",
      },
    ],
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
