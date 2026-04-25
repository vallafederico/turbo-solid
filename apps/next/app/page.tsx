import type { Metadata } from "next";

import { getHomeSeoPayload } from "@/lib/home-seo";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getHomeSeoPayload();
  if (!payload?.meta) {
    return {};
  }

  const { meta } = payload;

  return {
    title: meta.title ?? undefined,
    description: meta.description ?? undefined,
    robots: meta.robots,
    alternates: meta.canonicalUrl
      ? { canonical: meta.canonicalUrl }
      : undefined,
    openGraph: {
      title: meta.title ?? undefined,
      description: meta.description ?? undefined,
      url: meta.canonicalUrl ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title ?? undefined,
      description: meta.description ?? undefined,
    },
    icons: meta.favicons?.map(
      (f: { href: string; type?: string; sizes?: string }) => ({
        url: f.href,
        type: f.type,
        sizes: f.sizes,
      }),
    ),
  };
}

export default async function Home() {
  const payload = await getHomeSeoPayload();
  const schemas = payload?.schemas;

  return (
    <div className="min-h-[100vh] pt-20">
      {schemas?.map((schema: unknown, i: number) => (
        <script
          // eslint-disable-next-line react/no-array-index-key -- stable order from CMS
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </div>
  );
}
