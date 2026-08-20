import type { Metadata } from "next";
import { MuyuanResearchPage } from "@/components/muyuan-research-page";
import { getMuyuanSection } from "@/lib/muyuan";

const overview = getMuyuanSection("overview")!;

export const metadata: Metadata = {
  title: overview.title,
  description: overview.description,
  openGraph: { title: overview.title, description: overview.description, images: [] },
  twitter: { card: "summary", title: overview.title, description: overview.description, images: [] },
};

export default function MuyuanOverviewPage() {
  return <MuyuanResearchPage section={overview} />;
}
