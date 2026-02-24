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
      title: "work – eterlab.",
      alternates: { canonical: "/work" },
    };
  }

  const canonical = `/work/${work.slug}`;
  const description = work.summary.en;

  // Many covers are SVGs; social cards can be picky. Fall back to /og.png.
  const imageUrl = work.coverImage?.toLowerCase().endsWith(".svg") ? "/og.png" : work.coverImage;

  return {
    title: `${work.title} – eterlab.`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: `${work.title} – eterlab.`,
      description,
      images: [
        {
          url: imageUrl || "/og.png",
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${work.title} – eterlab.`,
      description,
      images: [imageUrl || "/og.png"],
    },
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  return <WorkPageClient work={work} />;
}


