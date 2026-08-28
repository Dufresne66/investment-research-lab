import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const repository = process.env.GITHUB_REPOSITORY?.split("/").at(-1);
const owner = process.env.GITHUB_REPOSITORY?.split("/").at(0);
const isUserPage = repository && owner && repository === `${owner}.github.io`;
const configuredBase = process.env.PUBLIC_BASE_PATH ?? (repository && !isUserPage ? `/${repository}` : "/");
const normalizedBase = configuredBase === "/" ? "" : `/${configuredBase.replace(/^\/+|\/+$/g, "")}`;

async function page(relativePath) {
  return readFile(new URL(relativePath, dist), "utf8");
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const resolved = path.join(directory, entry.name);
    files.push(...(entry.isDirectory() ? await walk(resolved) : [resolved]));
  }
  return files;
}

async function readLearningEntries() {
  const dir = new URL("src/content/learning/", root);
  const names = (await readdir(dir)).filter((name) => name.endsWith(".md"));
  const entries = [];
  for (const name of names) {
    const raw = await readFile(new URL(name, dir), "utf8");
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
    const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? "";
    const status = frontmatter.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? "";
    entries.push({ slug: name.replace(/\.md$/, ""), title, status });
  }
  return entries;
}

function learningHref(slug) {
  return `href="${normalizedBase}/learning/${slug}/"`;
}

test("renders the academic-style Investment Research Lab homepage", async () => {
  const html = await page("index.html");
  assert.match(html, /<title>Investment Research Lab<\/title>/i);
  assert.match(html, /Learning businesses from first principles/);
  assert.match(html, /MY-COST-001/);
  assert.match(html, /牧原股份/);
  assert.match(html, /贵州茅台/);
  assert.match(html, /小鹏集团/);
  assert.match(html, /阿里巴巴/);
  assert.match(html, /泡泡玛特/);
  assert.match(html, /Human-written only/);
  assert.doesNotMatch(html, /__next|react-server|vinext/i);
});

test("builds research and report entry pages for every tracked company", async () => {
  const companies = [
    ["maotai", "贵州茅台", "600519"],
    ["xpeng", "小鹏集团", "9868"],
    ["alibaba", "阿里巴巴", "9988"],
    ["pop-mart", "泡泡玛特", "9992"],
  ];

  for (const [slug, name, ticker] of companies) {
    const html = await page(`companies/${slug}/index.html`);
    assert.match(html, new RegExp(name));
    assert.match(html, new RegExp(ticker));
    assert.match(html, new RegExp(`companies/${slug}/reports/`));

    const reports = await page(`companies/${slug}/reports/index.html`);
    assert.match(reports, new RegExp(name));
    assert.match(reports, /官方报告索引/);
    assert.match(reports, /公开网站不保存本地 PDF/);
    assert.doesNotMatch(reports, /href="[^"]*\/investment-research-lab\/[^"]+\.pdf"/i);
  }
});

test("builds the full 00–15 Muyuan research path", async () => {
  const slugs = [
    "overview", "first-principles", "business-model", "unit-economics", "cycle", "moat",
    "competitors", "financials", "capital-allocation", "management", "risks",
    "normalized-earnings", "valuation", "thesis", "evidence-log", "thesis-changes",
  ];
  for (const slug of slugs) {
    await access(new URL(`companies/muyuan/${slug}/index.html`, dist));
  }

  const firstPrinciples = await page("companies/muyuan/first-principles/index.html");
  assert.match(firstPrinciples, /<title>牧原股份 · 第一性原理 · Investment Research Lab<\/title>/i);
  assert.match(firstPrinciples, /Profit ≈ Q × W × \(P − C\)/);
  assert.match(firstPrinciples, /HYPOTHESIS/);

  const evidence = await page("companies/muyuan/evidence-log/index.html");
  assert.match(evidence, /PAGE_ANCHOR_NEEDED/);
  assert.match(evidence, /MY-EV-2025-COST-001/);
});

test("publishes the two evidence-led Muyuan analyses", async () => {
  const monthly = await page("blog/muyuan-2026-07-sales/index.html");
  assert.match(monthly, /牧原股份 2026 年 7 月销售简报分析/);
  assert.match(monthly, /666\.1/);
  assert.match(monthly, /125\.53/);
  assert.match(monthly, /情景，不是月报事实/);
  assert.match(monthly, /NOT DISCLOSED/);
  assert.match(monthly, /MY-SRC-MS-2026-07/);
  assert.match(monthly, /1225460373\.PDF/);

  const halfYear = await page("blog/muyuan-2026-h1-review/index.html");
  assert.match(halfYear, /牧原股份 2026 年半年报分析/);
  assert.match(halfYear, /594\.1/);
  assert.match(halfYear, /60\.78/);
  assert.match(halfYear, /11\.7/);
  assert.match(halfYear, /DERIVED/);
  assert.match(halfYear, /MY-SRC-H1-2026/);
  assert.match(halfYear, /1225485220\.PDF/);
  assert.match(halfYear, /40% 人工置信度/);
});

test("provides direct official PDFs in the Muyuan report library", async () => {
  const html = await page("companies/muyuan/reports/index.html");
  assert.match(html, /牧原股份官方报告索引/);
  assert.match(html, /2026 年半年度报告/);
  assert.match(html, /2026 年 1 月份销售简报/);
  assert.match(html, /2026 年 7 月份销售简报/);
  assert.match(html, /2021 年年度报告/);
  assert.match(html, /2025 年年度报告/);
  assert.match(html, /static\.cninfo\.com\.cn\/finalpage/);
  assert.doesNotMatch(html, /href="\/investment-research-lab\/[^"]+\.pdf"/i);
});

test("publishes a reusable global reports hub without private file paths", async () => {
  const html = await page("reports/index.html");
  for (const name of ["牧原股份", "贵州茅台", "小鹏集团", "阿里巴巴", "泡泡玛特"]) {
    assert.match(html, new RegExp(name));
  }
  assert.match(html, /PRIMARY SOURCES FIRST/);
  assert.match(html, /PUBLICATION RULE/);
  assert.doesNotMatch(html, /\/Users\/dufresne|investment-research\/companies/i);

  const xpeng = await page("companies/xpeng/reports/index.html");
  assert.match(xpeng, /2026 年第二季度未经审计财务业绩/);
  assert.match(xpeng, /2026-08-24/);
  assert.doesNotMatch(xpeng, /PENDING — NOT YET RELEASED/);
  assert.match(xpeng, /sec\.gov\/Archives\/edgar/);
  assert.doesNotMatch(xpeng, /Official link pending/);
});

test("publishes the source-grounded XPENG R&D and technology-assets page", async () => {
  const html = await page("companies/xpeng/moat/index.html");
  assert.match(html, /研发与技术资产：从投入到外部变现/);
  assert.match(html, /data-xpeng-rd-dashboard/);
  assert.match(html, /七条技术树 × 五道证据门/);
  assert.match(html, /Volkswagen 转化漏斗/);
  assert.match(html, /ID\. UNYX 07 进入量产/);
  assert.match(html, /客户交付/);
  assert.match(html, /技术研发服务收入从未单独列报/);
  assert.match(html, /5 FULFILLED/);
  assert.match(html, /<strong[^>]*>9<\/strong><span[^>]*>OPEN_UNVERIFIED/);
  assert.match(html, /XPEV-SRC-VW-AUTOCHINA-2026/);
  assert.match(html, /Research updated 2026-08-28/);
  assert.doesNotMatch(html, /\/Users\/dufresne|investment-research\/companies|sha256/i);
  assert.doesNotMatch(html, /目标价|买入建议|卖出建议/);
});

test("uses the light system palette and allows human confidence to remain unassigned", async () => {
  const css = await readFile(new URL("src/styles/global.css", root), "utf8");
  assert.match(css, /--bg:\s*#f5f5f7/i);
  assert.match(css, /--surface:\s*#ffffff/i);
  assert.match(css, /--text:\s*#1d1d1f/i);
  assert.match(css, /--cyan:\s*#0071e3/i);
  assert.match(css, /border-radius:\s*24px/i);

  const config = await readFile(new URL("src/content.config.ts", root), "utf8");
  assert.match(config, /confidence: z\.number\(\)\.min\(0\)\.max\(100\)\.nullable\(\)/);

  const claim = await readFile(new URL("src/data/claims/muyuan.yaml", root), "utf8");
  assert.match(claim, /confidence: 40/);
});

test("provides a reusable source-grounded interview Learning architecture", async () => {
  const config = await readFile(new URL("src/content.config.ts", root), "utf8");
  assert.match(config, /content_type: z\.enum\(\["method", "concept", "interview-study"\]\)/);
  assert.match(config, /Interview studies require a verified primary_source record/);
  assert.match(config, /related_learning: z\.array\(z\.string\(\)\)/);

  const pageSource = await readFile(new URL("src/pages/learning/[id].astro", root), "utf8");
  assert.match(pageSource, /LearningSourcePanel/);
  assert.match(pageSource, /SOURCE-DERIVED/);
  assert.match(pageSource, /MY INTERPRETATION/);
  assert.match(pageSource, /MY PROCESS/);

  const css = await readFile(new URL("src/styles/global.css", root), "utf8");
  assert.match(css, /\.learning-document \.prose p, \.learning-document \.prose li \{ font-size: 17px/);
  assert.match(css, /\.learning-document \.prose table \{ display: block; overflow-x: auto/);

  await access(new URL("src/components/LearningSourcePanel.astro", root));
  await access(new URL("docs/learning-interview-architecture.md", root));

  const learningIndex = await page("learning/index.html");
  assert.match(learningIndex, /METHOD/);
  assert.match(learningIndex, /证据驱动的公司研究/);

  const method = await page("learning/research-method/index.html");
  assert.match(method, /LEARNING METHOD/);
  assert.match(method, /FACT → INFERENCE → HYPOTHESIS → EVIDENCE → UPDATE/);
});

test("publishes every active Learning entry into the index and its own route", async () => {
  const entries = await readLearningEntries();
  const active = entries.filter((entry) => entry.status === "active");
  assert.ok(active.length > 0, "expected at least one active Learning entry");

  const learningIndex = await page("learning/index.html");

  for (const { slug, title } of active) {
    await access(new URL(`learning/${slug}/index.html`, dist));
    assert.ok(learningIndex.includes(title), `Learning index is missing the title of ${slug}`);
    assert.ok(learningIndex.includes(learningHref(slug)), `Learning index is missing the link ${learningHref(slug)}`);

    const standalone = await page(`learning/${slug}/index.html`);
    assert.ok(standalone.includes(title), `Standalone page for ${slug} does not show its title`);
  }
});

test("renders the Shan Weijian interview study with its verified source panel", async () => {
  const slug = "shan-weijian-investing-like-archaeology";
  const learningIndex = await page("learning/index.html");
  assert.match(learningIndex, /投资如考古/);

  const html = await page(`learning/${slug}/index.html`);
  assert.match(html, /INTERVIEW STUDY/);
  assert.match(html, /PRIMARY SOURCE/);
  assert.match(html, /ORIGINAL AND REPOST VERIFIED/);
  assert.match(html, /https:\/\/www\.nbd\.com\.cn\/articles\/2026-06-23\/4434183\.html/);
});

test("orders the Learning index newest-first with order as the same-day tiebreaker", async () => {
  const learningIndex = await page("learning/index.html");
  const interviewPos = learningIndex.indexOf(learningHref("shan-weijian-investing-like-archaeology"));
  const methodPos = learningIndex.indexOf(learningHref("research-method"));
  assert.ok(interviewPos !== -1, "interview link missing from Learning index");
  assert.ok(methodPos !== -1, "research-method link missing from Learning index");
  assert.ok(interviewPos < methodPos, "the newer interview must appear before the older research method");
});

test("keeps every published Claim evidence reference linked to the public ledger", async () => {
  const companies = ["maotai", "pop-mart", "alibaba", "xpeng"];
  const missing = [];
  const missingSources = [];

  for (const slug of companies) {
    const claim = await readFile(new URL(`src/data/claims/${slug}.yaml`, root), "utf8");
    const company = JSON.parse(await readFile(new URL(`src/data/companies/${slug}.json`, root), "utf8"));
    const defined = new Set(company.evidence.map((item) => item.evidence_id));
    const definedSources = new Set(company.sources.map((item) => item.source_id));
    const referenced = [...claim.matchAll(/\b(?:MT|PM|BABA|XPEV)-(?:EV|CE)-[A-Z0-9-]+\b/g)].map((match) => match[0]);

    for (const evidenceId of referenced) {
      if (!defined.has(evidenceId)) missing.push(`${slug} → ${evidenceId}`);
    }

    for (const evidence of company.evidence) {
      const sourceIds = [evidence.source_id, ...(evidence.source_refs ?? []).map((item) => item.source_id)];
      for (const sourceId of sourceIds) {
        if (!definedSources.has(sourceId)) missingSources.push(`${evidence.evidence_id} → ${sourceId}`);
      }
    }
  }

  assert.deepEqual(missing, []);
  assert.deepEqual(missingSources, []);
});

test("keeps the Claim centralized and removes framework dependencies", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  for (const name of ["next", "vinext", "react", "react-dom", "react-server-dom-webpack", "tailwindcss", "wrangler"]) {
    assert.equal(dependencies[name], undefined, `${name} should not remain`);
  }

  const claim = await readFile(new URL("src/data/claims/muyuan.yaml", root), "utf8");
  assert.match(claim, /id: MY-COST-001/);
  assert.match(claim, /status: OPEN/);
  assert.match(claim, /confidence: 40/);
  await assert.rejects(access(new URL("app/page.tsx", root)));
  await assert.rejects(access(new URL(".openai/hosting.json", root)));
});

test("uses the current official GitHub Pages actions", async () => {
  const workflow = await readFile(new URL(".github/workflows/deploy.yml", root), "utf8");
  assert.match(workflow, /actions\/setup-node@v6/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /branches: \[main\]/);
});

test("has no broken internal links in generated HTML", async () => {
  const distPath = fileURLToPath(dist);
  const files = await walk(distPath);
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  const missing = [];

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const absolutePath = href.split(/[?#]/)[0];
      const clean = normalizedBase && absolutePath.startsWith(`${normalizedBase}/`)
        ? absolutePath.slice(normalizedBase.length)
        : absolutePath;
      if (!clean) continue;
      const target = clean.endsWith("/") ? `${clean}index.html` : clean;
      try {
        await access(path.join(distPath, target));
      } catch {
        missing.push(`${path.relative(distPath, htmlFile)} → ${href}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
