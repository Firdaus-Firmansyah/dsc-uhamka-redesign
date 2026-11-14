import type { Metadata } from 'next';
export const siteUrl = process.env.SITE_URL || 'https://dsc-uhamka.vercel.app';
export function pageMetadata(title: string, slug: string, description = 'Learn, build, and belong with Developer Student Clubs UHAMKA.'): Metadata {
  const image = `/api/og/${encodeURIComponent(slug)}`;
  return { title, description, openGraph: { title, description, siteName: 'DSC UHAMKA', images: [{ url: image, width: 1200, height: 630, alt: title }] }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}
