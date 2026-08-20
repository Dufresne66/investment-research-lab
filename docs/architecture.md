# Investment Research OS 架构与研究规范

## 1. 系统边界

Investment Research OS 是 KnowledgeBase 投资学习的独立软件载体，不是第二套投资知识库。

- KnowledgeBase 拥有原始 PDF、股东信、投资概念、日常学习、研究计划和阶段性公司卡。
- 本工作区拥有网站代码、研究正文 MDX、Claim / Evidence Ledger、结构化财务数据、页面和测试。
- 网站只保存原始资料的引用和页码，不复制 PDF。
- 阶段性公司结论形成后，再人工沉淀为 KnowledgeBase 公司卡。

## 2. 核心研究循环

研究顺序固定为：

`事实 → 理解 → 假设 → 证据 → 反证 → 估值 → 决策 → 复盘`

第一版不接入实时行情、交易、登录、数据库或自动推荐系统。先用本地文件和版本历史保证可读、可查、可回退。

## 3. 三类陈述

### FACT

必须有原始来源支持。每条事实至少记录来源标题；页码暂未定位时必须写 `PAGE_ANCHOR_NEEDED`，不能假装已经精确验证。

### INFERENCE

基于一个或多个事实形成的解释。必须能指出输入事实和推理跳步，不能升级为事实。

### HYPOTHESIS

尚待验证的投资假设。必须绑定 Claim ID、状态、置信度、支持证据、反对证据、待补证据与最后更新时间。

## 4. 数据所有权

### MDX 负责思想

公司研究的长文本放在 `content/companies/<slug>/`。它记录问题、理解、推理、边界、反证和判断变化。

### JSON 负责结构

公司身份、经济模型、Claim、Evidence、风险、来源索引和以后加入的财务指标放在 `data/companies/<slug>.json`。JSON 不保存大段文章。

### 页面负责展示

页面只消费 MDX 与 JSON，不在界面组件内悄悄保存另一份研究结论。公司详情页的标题、描述和可分享元数据来自同一份 section record。

## 5. Claim 生命周期

允许状态：

- `OPEN`：证据不足，仍在研究；
- `SUPPORTED`：当前证据明显支持，但仍可反证；
- `WEAKENED`：关键反证出现或证据质量下降；
- `REJECTED`：证伪条件已经满足；
- `ARCHIVED`：研究问题不再适用，但历史保留。

置信度是研究者当前主观概率，不是统计显著性，也不由 AI 自动更新。每次变化必须写入日期、触发证据和修改理由。

## 6. Evidence Ledger 最小字段

每条证据至少包含：

- `evidence_id`
- `claim_id`
- `type`
- `statement`
- `direction`
- `source_title`
- `source_library`
- `source_page`
- `source_locator_status`
- `verification_status`
- `recorded_at`
- `note`

“文件存在”不等于“命题已验证”。当前牧原 2025 成本事实保留为 `SOURCE_FILE_PRESENT + PAGE_ANCHOR_NEEDED`，下一阶段必须定位年报页码和原文。

## 7. 人与 AI 的责任

AI 可以：提取数字、解释财报、检查计算、比较同行、寻找反证、发现逻辑漏洞、整理格式。

AI 不可以：把未验证判断标成 FACT、自动提高 Claim 置信度、替用户写最终投资决策、隐藏不利证据。

所有投资决定区域统一标记 `Human-written only`。

## 8. 新公司接入门槛

第二家公司进入系统前，至少应完成：

1. 一句话经济模型；
2. 一个可证伪的核心 Claim；
3. 一个 Evidence Ledger；
4. 一组风险观察信号；
5. 原始来源索引；
6. Overview、First Principles、Thesis、Evidence、Risks 五个最小页面。

先用牧原连续研究一个完整阶段，再决定是否扩展数据库、图表、同行对比或估值工具。
