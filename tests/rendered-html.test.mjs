import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

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

test("renders the academic-style Investment Research Lab homepage", async () => {
  const html = await page("index.html");
  assert.match(html, /<title>Investment Research Lab<\/title>/i);
  assert.match(html, /Learning businesses from first principles/);
  assert.match(html, /MY-COST-001/);
  assert.match(html, /牧原股份/);
  assert.match(html, /Human-written only/);
  assert.doesNotMatch(html, /__next|react-server|vinext/i);
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
      const clean = href.split(/[?#]/)[0];
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
