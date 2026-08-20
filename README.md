# Investment Research OS

这是一个本地优先、证据驱动的个人投资研究网站。它不提供实时行情，也不替人做买卖决定；它用于记录“事实 → 推论 → 假设 → 证据 → 反证 → 估值 → 决策 → 复盘”的完整过程。

当前第一家公司：**牧原股份（002714.SZ）**。

## 当前版本包含什么

- 研究总览 Dashboard；
- 牧原 Overview、第一性原理、Investment Thesis、Evidence Ledger、风险与反证页面；
- `FACT / INFERENCE / HYPOTHESIS` 内容边界；
- Claim ID、置信度、支持证据、反对证据和待补证据；
- 牧原 2021–2025 年报的来源索引；
- 适合电脑和手机阅读的界面。

## 内容放在哪里

| 内容 | 位置 |
|---|---|
| 长文章与研究正文 | `content/companies/<公司>/` |
| Claim、Evidence、风险和结构化数字 | `data/companies/<公司>.json` |
| 网站页面 | `app/` |
| 可复用界面 | `components/` |
| 数据与内容读取规则 | `lib/` |
| 架构和研究规范 | `docs/` |

原始年报不复制进网站，继续保存在：

`/Users/dufresne/knowledgebase/KnowledgeBase/10_Inputs/investment/annual_reports/`

## 如何添加第二家公司

1. 在 `content/companies/` 下建立公司的文件夹，复制牧原的五个 MDX 文件作为初始模板。
2. 在 `data/companies/` 下建立一个同名 JSON 文件，填写公司身份、经济模型、Claim、Evidence、风险与来源。
3. 建立公司的页面入口，并把它加入首页公司列表。
4. 至少为一条核心 Claim 写出反证条件和 `evidence_needed`。
5. 任何 `FACT` 都必须有原始来源；暂时没有页码时标记 `PAGE_ANCHOR_NEEDED`，不能伪造定位。
6. 最终投资判断必须由本人书写，AI 只做阅读、计算、整理和反方挑战。

## 本地使用

需要 Node.js 22.13 或更高版本。安装依赖后启动本地预览；完成修改后运行构建和测试。具体技术命令保留在项目脚本中，日常研究只需维护 MDX 和 JSON 文件。

## 下一轮研究

先完成牧原的单位经济模型：把 Q、W、P、C 继续拆成可观测指标，并从 2021–2025 年报逐条建立页码级证据锚点。完成这一阶段前，不进入精确估值，也不形成买卖结论。

详细设计决定见 [docs/architecture.md](docs/architecture.md)。
