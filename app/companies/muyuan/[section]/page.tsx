import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MuyuanResearchPage } from "@/components/muyuan-research-page";
import { getMuyuanSection, muyuanSections } from "@/lib/muyuan";

type PageProps = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return muyuanSections.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getMuyuanSection(slug);
  if (!section) return {};

  return {
    title: section.title,
    description: section.description,
    openGraph: { title: section.title, description: section.description, images: [] },
    twitter: { card: "summary", title: section.title, description: section.description, images: [] },
  };
}

export default async function MuyuanSectionPage({ params }: PageProps) {
  const { section: slug } = await params;
  const section = getMuyuanSection(slug);
  if (!section) notFound();
  return <MuyuanResearchPage section={section} />;
}
