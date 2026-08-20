# Investment Research Lab

这是一个证据驱动的个人投资研究公开网站。它不提供实时行情，也不替你做买卖决定；它只发布已经整理和人工批准的公司研究、投资理论、判断变化与复盘。

公开网址：[https://dufresne66.github.io/investment-research-lab/](https://dufresne66.github.io/investment-research-lab/)

本仓库是公开出版层。日常阅读、原始资料、计算、草稿 Claim 和未完成判断位于相邻的私人研究仓库：

```text
/Users/dufresne/Investment/investment-research/
```

当前研究池：**牧原股份、贵州茅台、小鹏集团、阿里巴巴、泡泡玛特**。牧原正在研究，其余四家公司只建立入口，尚未加入研究内容。

## 你平时只需要知道什么

只有经过发布筛选的内容才修改这里：

```text
src/content/
├── companies/   公司研究
├── learning/    投资理论与通用概念
└── journal/     研究日志与复盘
```

每篇文章都是 `.md` 普通文本。网站程序由 Astro 在背后把 Markdown 变成网页，不需要维护服务器。

结构化 Claim 在 `src/data/claims/`，公司资料索引、Evidence 与风险在 `src/data/companies/`。同一条 Claim 只保存一份，网页会自动读取。

## 本地查看

第一次使用，在项目文件夹中运行：

```bash
pnpm install
pnpm dev
```

然后打开：

```text
http://localhost:3000
```

修改 Markdown 后，网页会自动刷新。结束时可在终端按 `Control + C`。

## GitHub Pages 发布状态

项目已经连接到 GitHub，并通过 `.github/workflows/deploy.yml` 自动发布：

```text
GitHub: https://github.com/Dufresne66/investment-research-lab
Pages: https://dufresne66.github.io/investment-research-lab/
```

用户批准一项 Publication Candidate 后，才把整理后的内容加入本站。推送 `main` 后，GitHub Actions 会自动构建并发布 `dist/`。

常规发布命令：

```bash
git add .
git commit -m "update muyuan research"
git push
```

项目会自动适配 `username.github.io/repository/` 子路径。

完整的非技术发布步骤见 [docs/publishing-github-pages.md](docs/publishing-github-pages.md)。

## 添加一家公司

以“公司英文短名”为目录名，例如 `new-company`：

1. 在 `src/data/companies/` 新建 `new-company.json`，只填写公司身份并把状态设为 `PLANNED`；
2. 网站会自动把公司卡加入首页，并生成空白公司研究页；
3. 真正开始研究时，复制 `src/content/companies/muyuan/` 为 `src/content/companies/new-company/`；
4. 保留 00–15 对应文件名，修改每篇 frontmatter 的标题、描述、状态和日期；
5. 在 `src/data/claims/` 新建 `new-company.yaml`，至少写一个可证伪的 OPEN Claim；
6. 在公司 JSON 中填入 `primary_claim_id`、经济模型、Evidence、风险和来源；
7. 运行 `pnpm check`、`pnpm test`，确认后再推送。

接入门槛：一句话经济模型、一个可证伪 Claim、Evidence Ledger、风险观察信号、原始来源索引，以及 Overview / First Principles / Thesis / Evidence / Risks 五个最小页面。

## 研究纪律

- `FACT` 必须能回到原始来源；
- `INFERENCE` 必须写清从事实到解释的推理；
- `HYPOTHESIS` 必须绑定 Claim 并允许被反证；
- 置信度由本人更新，不由 AI 自动提高；
- 最终投资判断统一为 `Human-written only`。

原始年报保存在相邻的私人研究仓库，不复制进公开网站：

```text
/Users/dufresne/Investment/investment-research/companies/<slug>/sources/
```

## 常用检查

```bash
pnpm check   # 检查内容与页面类型
pnpm build   # 生成纯静态网页到 dist/
pnpm test    # 构建并检查路由、链接和研究边界
```

架构规则见 [docs/architecture.md](docs/architecture.md)，本次迁移记录见 [docs/migration-plan.md](docs/migration-plan.md)。
