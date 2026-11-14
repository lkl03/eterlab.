import { notFound } from "next/navigation";
import type { Metadata } from "next";

import WorkPageClient from "../../../components/work/WorkPageClient";
import { getWorkBySlug } from "../../../lib/work";

// NOTE:
// Turbopack + generateStaticParams can be a bit finicky while iterating.
// For this site we prefer correctness (no unexpected 404) over SSG.
export const dynamic = "force-dynamic";

type Props = {
  // Next.js 16+ can treat dynamic segment APIs as async in some runtimes.
  // Await params before accessing properties to avoid sync-dynamic-apis errors.
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) {
    return {
      title: "Trabajo no encontrado – eterlab.",
      robots: { index: false, follow: true },
    };
  }

  const canonical = `/work/${work.slug}`;
  // The page renders in Spanish first (html lang="es"), so describe it in Spanish.
  const description = work.summary.es;
  const title = `${work.title}: caso de diseño y desarrollo web – eterlab.`;

  // Prefer the scroll-preview poster (a real screenshot); SVG covers are not
  // accepted by most social cards, so those fall back to /og.png.
  const cover = work.previewPoster ?? work.coverImage;
  const image =
    cover && !cover.toLowerCase().endsWith(".svg")
      ? { url: cover, alt: work.title }
      : { url: "/og.png", width: 1200, height: 630, alt: "eterlab." };

  return {
    // Full string: /work/layout sets a plain title, so no template applies here.
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  return <WorkPageClient work={work} />;
}


