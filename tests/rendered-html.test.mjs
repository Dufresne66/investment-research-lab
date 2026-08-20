import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the Investment Research OS dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Investment Research OS<\/title>/i);
  assert.match(html, /把投资判断/);
  assert.match(html, /MY-COST-001/);
  assert.match(html, /牧原股份/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("uses record-specific metadata on shareable research routes", async () => {
  const cases = [
    ["/companies/muyuan/first-principles", "牧原股份第一性原理", "从生猪养殖的收入与成本变量理解牧原如何赚钱"],
    ["/companies/muyuan/evidence", "牧原股份 Evidence Ledger", "牧原核心命题的证据、反证与待定位来源"],
  ];

  for (const [pathname, title, description] of cases) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title}<\\/title>`, "i"));
    assert.match(html, new RegExp(description));
    assert.doesNotMatch(html, /og\.png/i);
  }
});

test("keeps facts traceable and removes starter-only files", async () => {
  const data = JSON.parse(await readFile(new URL("../data/companies/muyuan.json", import.meta.url), "utf8"));
  const fact = data.evidence.find((item) => item.type === "FACT");

  assert.ok(fact);
  assert.ok(fact.claim_id);
  assert.ok(fact.source_title);
  assert.equal(fact.source_locator_status, "PAGE_ANCHOR_NEEDED");
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
