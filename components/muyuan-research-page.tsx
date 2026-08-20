import Link from "next/link";
import { MarkdownDocument } from "@/components/markdown-document";
import { muyuan, muyuanSections, type MuyuanSection } from "@/lib/muyuan";

export function MuyuanResearchPage({ section }: { section: MuyuanSection }) {
  const claim = muyuan.claims[0];
  const locatedSources = muyuan.sources.length;

  return (
    <main className="detail-shell">
      <aside className="detail-sidebar">
        <Link className="brand detail-brand" href="/">
          <span className="brand-mark">IR</span>
          <span><strong>Investment</strong><small>Research OS</small></span>
        </Link>

        <div className="company-switcher">
          <span className="company-monogram small">牧</span>
          <div><strong>牧原股份</strong><small>002714 · SZ</small></div>
        </div>

        <nav className="research-nav" aria-label="牧原研究导航">
          {muyuanSections.map((item) => (
            <Link className={item.slug === section.slug ? "research-link active" : "research-link"} href={`/companies/muyuan/${item.slug}`} key={item.slug}>
              <span>{item.index}</span>{item.label}
            </Link>
          ))}
          <div className="nav-future"><span>02–09</span>后续研究阶段</div>
          <div className="nav-future"><span>11–12</span>利润与估值</div>
          <div className="nav-future"><span>15</span>Thesis Changes</div>
        </nav>

        <Link className="back-link" href="/">← 返回研究总览</Link>
      </aside>

      <section className="detail-workspace">
        <header className="detail-topbar">
          <div className="breadcrumb"><Link href="/">Companies</Link><span>/</span><b>牧原股份</b><span>/</span>{section.label}</div>
          <div className="detail-status"><i /> Research in progress</div>
        </header>

        <div className="detail-content">
          <article className="document-card">
            <MarkdownDocument source={section.document} />
          </article>

          <aside className="context-rail">
            <section className="context-card claim-context">
              <div className="context-label"><span>CORE CLAIM</span><b>{claim.status}</b></div>
              <code>{claim.claim_id}</code>
              <p>{claim.statement}</p>
              <div className="mini-confidence"><span><i style={{ width: `${claim.confidence * 100}%` }} /></span><b>{claim.confidence * 100}%</b></div>
            </section>

            <section className="context-card">
              <div className="context-label"><span>SOURCE STATUS</span><b className="available">AVAILABLE</b></div>
              <strong>{locatedSources} 份年度报告</strong>
              <p>2021–2025 年原始 PDF 保存在 KnowledgeBase；本网站只记录引用、页码和判断变化。</p>
            </section>

            <section className="context-card principle-card">
              <span>CONTENT RULE</span>
              <p><b>FACT</b> 必须指向原始来源；<b>INFERENCE</b> 必须写清推理；<b>HYPOTHESIS</b> 必须允许被反证。</p>
            </section>

            <section className="human-judgment-card">
              <span>H</span>
              <div><small>Investment Decision</small><strong>Human-written only</strong></div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
