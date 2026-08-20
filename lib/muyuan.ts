import company from "@/data/companies/muyuan.json";
import evidence from "@/content/companies/muyuan/evidence.mdx?raw";
import firstPrinciples from "@/content/companies/muyuan/first-principles.mdx?raw";
import overview from "@/content/companies/muyuan/overview.mdx?raw";
import risks from "@/content/companies/muyuan/risks.mdx?raw";
import thesis from "@/content/companies/muyuan/thesis.mdx?raw";

export const muyuan = company;

export const muyuanSections = [
  {
    slug: "overview",
    index: "00",
    label: "Overview",
    title: "牧原股份研究总览",
    description: "牧原股份研究边界、当前问题与下一步。",
    document: overview,
  },
  {
    slug: "first-principles",
    index: "01",
    label: "第一性原理",
    title: "牧原股份第一性原理",
    description: "从生猪养殖的收入与成本变量理解牧原如何赚钱。",
    document: firstPrinciples,
  },
  {
    slug: "thesis",
    index: "13",
    label: "Investment Thesis",
    title: "牧原股份 Investment Thesis",
    description: "牧原核心投资假设及其当前置信度。",
    document: thesis,
  },
  {
    slug: "evidence",
    index: "14",
    label: "Evidence Ledger",
    title: "牧原股份 Evidence Ledger",
    description: "牧原核心命题的证据、反证与待定位来源。",
    document: evidence,
  },
  {
    slug: "risks",
    index: "10",
    label: "风险与反证",
    title: "牧原股份风险与反证",
    description: "用可证伪条件压力测试牧原投资假设。",
    document: risks,
  },
] as const;

export type MuyuanSection = (typeof muyuanSections)[number];

export function getMuyuanSection(slug: string) {
  return muyuanSections.find((section) => section.slug === slug);
}
