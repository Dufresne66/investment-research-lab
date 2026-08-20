# Investment Research Lab 架构与研究规范

## 1. 系统边界

Investment Research Lab 是 Investment 工作区的公开出版层，不是原始资料库，也不是日常研究环境。

- 相邻的 `investment-research/` 私人仓库拥有原始资料、阅读笔记、研究问题、计算、比较、Claim 草稿、反证和判断历史；
- 本仓库拥有 Astro 网站、经过人工批准的研究正文、公开 Claim / Evidence、页面和测试；
- 网站只保存稳定的来源 ID、页码或章节定位，不复制 PDF；
- 私人研究先进入 Publication Candidate，用户明确批准后才人工整理进本站。

## 2. 技术原则

网站只使用 Astro、Markdown、少量 TypeScript 与普通 CSS。构建结果是 `dist/` 中的静态 HTML/CSS，不需要 Node 服务器。

第一阶段不接入 React、实时行情、交易、登录、数据库、评论、在线编辑器、AI 聊天或 CMS。

## 3. 内容与数据所有权

| 内容 | 唯一位置 |
|---|---|
| 已批准的公司研究正文 | `src/content/companies/<slug>/` |
| 已批准的投资理论 | `src/content/learning/` |
| 适合公开的研究日志与复盘 | `src/content/journal/` |
| 已批准的 Claim | `src/data/claims/<slug>.yaml` |
| 公开公司身份、Evidence、风险、来源索引 | `src/data/companies/<slug>.json` |
| 页面 | `src/pages/` |
| 视觉组件 | `src/components/` |

页面只消费 Markdown、YAML 与 JSON，不在组件中悄悄保存第二份研究结论。

私人研究层的文件结构与发布候选由 `/Users/dufresne/Investment/investment-research/` 管理；本仓库不直接引用私人绝对路径，避免把本地结构或资料意外暴露到网页。

## 4. 核心研究循环

`事实 → 理解 → 假设 → 证据 → 反证 → 估值 → 决策 → 复盘`

### FACT

必须有原始来源。页码暂未定位时写 `PAGE_ANCHOR_NEEDED`，不能假装已经精确验证。

### INFERENCE

必须能指出输入事实与推理步骤，不能升级为事实。

### HYPOTHESIS

必须绑定 Claim ID、状态、人工置信度、正反证据、待补证据与最后更新时间。

## 5. Claim 生命周期

- `OPEN`：证据不足，仍在研究；
- `SUPPORTED`：当前证据明显支持，但仍可反证；
- `WEAKENED`：关键反证出现或证据质量下降；
- `REJECTED`：证伪条件已经满足；
- `ARCHIVED`：研究问题不再适用，但历史保留。

置信度是研究者当前主观概率，不是统计显著性，也不由 AI 自动更新。每次变化必须进入 Thesis Changes。

## 6. 人与 AI 的责任

AI 可以提取数字、解释财报、检查计算、比较同行、寻找反证、发现逻辑漏洞与整理格式。

AI 不可以把未验证判断标成 FACT、自动提高 Claim 置信度、替用户写最终投资决策或隐藏不利证据。所有投资决定区域统一标记 `Human-written only`。

## 7. 稳定 URL 与 GitHub Pages

公司研究章节使用 `/companies/<slug>/<section>/`。所有站内链接通过 Astro `BASE_URL` 生成，使根域名与 GitHub 项目子路径都能工作。

GitHub workflow 只在 `main` 推送后构建并发布 `dist/`；本地 Markdown 仍是长期源文件，生成目录不进入 Git。
