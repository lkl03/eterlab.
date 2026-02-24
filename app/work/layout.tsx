import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "work – eterlab.",
  description: "Client work, shipped with a performance-first mindset.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    type: "website",
    url: "/work",
    title: "work – eterlab.",
    description: "Client work, shipped with a performance-first mindset.",
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