export const companySections = [
  ["00", "overview", "Overview"],
  ["01", "first-principles", "First Principles"],
  ["02", "business-model", "Business Model"],
  ["03", "unit-economics", "Unit Economics"],
  ["04", "cycle", "Industry / Cycle"],
  ["05", "moat", "Moat"],
  ["06", "competitors", "Competitors"],
  ["07", "financials", "Financials"],
  ["08", "capital-allocation", "Capital Allocation"],
  ["09", "management", "Management & Culture"],
  ["10", "risks", "Risks / Inversion"],
  ["11", "normalized-earnings", "Normalized Earnings"],
  ["12", "valuation", "Valuation"],
  ["13", "thesis", "Investment Thesis"],
  ["14", "evidence-log", "Evidence Log"],
  ["15", "thesis-changes", "Thesis Changes"],
] as const;

export const researchLoop = [
  "事实",
  "理解",
  "假设",
  "证据",
  "反证",
  "估值",
  "决策",
  "复盘",
] as const;

export type ResearchSection = (typeof companySections)[number];
