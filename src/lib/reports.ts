import type { CollectionEntry } from "astro:content";

import alibabaReports from "../data/reports/alibaba.json";
import maotaiReports from "../data/reports/maotai.json";
import muyuanReports from "../data/reports/muyuan.json";
import popMartReports from "../data/reports/pop-mart.json";
import xpengReports from "../data/reports/xpeng.json";

export type PublicationStatus = "published" | "pending";

export type VerificationStatus =
  | "VERIFIED"
  | "HASH_VERIFIED"
  | "LINK_VERIFIED"
  | "OFFICIAL_LINK"
  | "NOT_YET_VERIFIED";

export interface ReportItem {
  source_id: string;
  title: string;
  period: string;
  published: string | null;
  pages: number | null;
  official_url: string | null;
  publication_status: PublicationStatus;
  verification_status: VerificationStatus;
  analysis_href: string | null;
  analysis_status: PublicationStatus;
  note?: string;
}

export interface ReportGroup {
  id: string;
  title: string;
  description: string;
  items: ReportItem[];
}

export interface AnnualAnalysisEntry {
  title: string;
  period: string | null;
  href: string | null;
  status: PublicationStatus;
  summary: string;
}

export interface ReportLibrary {
  company_slug: string;
  updated: string;
  latest_annual_analysis: AnnualAnalysisEntry;
  groups: ReportGroup[];
}

const reportLibraries = [
  muyuanReports,
  maotaiReports,
  xpengReports,
  alibabaReports,
  popMartReports,
] as ReportLibrary[];

export function getReportLibraries() {
  return reportLibraries;
}

export function getReportLibrary(companySlug: string) {
  return reportLibraries.find((library) => library.company_slug === companySlug);
}

export function getPublishedReports(library: ReportLibrary) {
  return library.groups
    .flatMap((group) => group.items)
    .filter(
      (report): report is ReportItem & { official_url: string } =>
        report.publication_status === "published" && Boolean(report.official_url),
    )
    .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
}

export function getReportBySourceId(companySlug: string, sourceId: string) {
  return getReportLibrary(companySlug)?.groups
    .flatMap((group) => group.items)
    .find((report) => report.source_id === sourceId);
}

export function getReportCompany(
  companies: CollectionEntry<"companies">[],
  companySlug: string,
) {
  return companies.find((entry) => entry.data.slug === companySlug);
}
