import Link from "next/link";

const researchSteps = [
  "第一性原理",
  "商业模式",
  "单位经济模型",
  "行业与周期",
  "成本与护城河",
  "财务与资本配置",
  "风险与反证",
  "估值与复盘",
];

export default function Home() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">IR</span>
          <span>
            <strong>Investment</strong>
            <small>Research OS</small>
          </span>
        </div>

        <nav className="primary-nav" aria-label="主导航">
          <a className="nav-item active" href="#dashboard"><span>⌂</span>研究总览</a>
          <a className="nav-item" href="#companies"><span>◫</span>公司研究</a>
          <a className="nav-item" href="#learning"><span>◇</span>投资学习</a>
          <a className="nav-item" href="#reviews"><span>↺</span>判断复盘</a>
        </nav>

        <div className="sidebar-note">
          <span className="eyebrow">研究原则</span>
          <p>先分清事实与判断，再讨论估值与决策。</p>
        </div>

        <div className="human-only">
          <span>H</span>
          <div>
            <small>最终投资判断</small>
            <strong>Human-written only</strong>
          </div>
        </div>
      </aside>

      <section className="workspace" id="dashboard">
        <header className="topbar">
          <div className="mobile-brand">Investment Research OS</div>
          <div className="topbar-meta">
            <span className="status-dot" /> 本地研究库
            <span className="topbar-separator" />
            2026 · 研究第 1 家公司
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero">
            <div>
              <p className="eyebrow">INVESTMENT RESEARCH LAB</p>
              <h1>把投资判断，变成一条<br />可以复查的证据链。</h1>
              <p className="hero-copy">
                从企业如何赚钱出发，提出假设、寻找证据、主动反证，
                最后才进入估值。这里记录的不是行情，而是你的判断如何形成、如何改变。
              </p>
            </div>
            <div className="research-loop" aria-label="研究流程">
              <div className="loop-center"><small>研究循环</small><strong>判断更新</strong></div>
              <span className="loop-node node-one">事实</span>
              <span className="loop-node node-two">假设</span>
              <span className="loop-node node-three">反证</span>
              <span className="loop-node node-four">复盘</span>
            </div>
          </section>

          <section className="section-block" id="companies">
            <div className="section-heading">
              <div><p className="eyebrow">COMPANIES</p><h2>正在研究</h2></div>
              <span className="count-pill">1 家公司</span>
            </div>

            <article className="company-card">
              <div className="company-identity">
                <div className="company-monogram">牧</div>
                <div>
                  <div className="company-title-row"><h3>牧原股份</h3><span className="ticker">002714 · SZ</span></div>
                  <p>生猪养殖 · 中国</p>
                </div>
              </div>

              <div className="company-thesis">
                <span className="eyebrow">一句话经济模型</span>
                <p className="formula">Profit ≈ Q × W × (P − C)</p>
                <p>无法决定猪价 P 时，持续降低单位完全养殖成本 C。</p>
              </div>

              <div className="company-status">
                <span className="status-label">研究状态</span>
                <strong><i /> 建立证据链</strong>
                <small>核心 Claim：1 个 OPEN</small>
              </div>

              <Link className="primary-action" href="/companies/muyuan/overview">进入研究 <span>→</span></Link>
            </article>
          </section>

          <section className="research-grid" id="muyuan">
            <article className="claim-panel">
              <div className="panel-heading">
                <div><span className="eyebrow">CURRENT CLAIM</span><span className="claim-id">MY-COST-001</span></div>
                <span className="open-badge">OPEN</span>
              </div>
              <h3>牧原能否长期保持显著低于行业平均的完全养殖成本？</h3>
              <div className="confidence-row">
                <div><small>当前信心</small><strong>40%</strong></div>
                <div className="confidence-track"><span /></div>
              </div>
              <div className="evidence-row">
                <div className="evidence-item fact">
                  <span>FACT</span>
                  <p>2025 年完全养殖成本约 12 元/kg，同比下降约 2 元/kg。</p>
                </div>
                <div className="evidence-item needed">
                  <span>EVIDENCE NEEDED</span>
                  <p>同行成本、行业均值，以及跨越完整猪周期的长期可比数据。</p>
                </div>
              </div>
            </article>

            <article className="source-panel">
              <div className="panel-heading">
                <div><span className="eyebrow">SOURCE LIBRARY</span><h3>原始资料</h3></div>
                <span className="source-count">5</span>
              </div>
              <p>牧原股份年度报告已保存在 KnowledgeBase，网站只维护引用与证据定位。</p>
              <div className="year-list">
                {[2025, 2024, 2023, 2022, 2021].map((year, index) => (
                  <div className="year-item" key={year}>
                    <span>{year} 年年度报告</span>
                    <small>{index === 0 ? "当前基准" : "历史证据"}</small>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="section-block learning-block" id="learning">
            <div className="section-heading">
              <div><p className="eyebrow">RESEARCH MAP</p><h2>牧原研究路径</h2></div>
              <p>先理解生意，再读取数字。</p>
            </div>
            <div className="step-grid">
              {researchSteps.map((step, index) => (
                <div className={index === 0 ? "step-card current" : "step-card"} key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                  <small>{index === 0 ? "当前阶段" : "待研究"}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="review-callout" id="reviews">
            <div>
              <p className="eyebrow">REVIEW SYSTEM</p>
              <h2>判断变化和错误，都不删除。</h2>
              <p>以后每一次 Thesis 更新都保留时间、触发证据与原判断，让“我为什么改变看法”可以被复查。</p>
            </div>
            <span>Thesis Changes · Mistake Log · Annual Review</span>
          </section>
        </div>
      </section>
    </main>
  );
}
