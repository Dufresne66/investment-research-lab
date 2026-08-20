# Investment Research Lab

这是一个本地优先、证据驱动的个人投资研究网站。它不提供实时行情，也不替你做买卖决定；它把公司研究、投资理论、判断变化和复盘长期保存为普通 Markdown 文件。

第一家公司：**牧原股份（002714.SZ）**。

## 你平时只需要知道什么

日常研究主要修改这里：

```text
src/content/
├── companies/   公司研究
├── learning/    投资理论与通用概念
└── journal/     研究日志与复盘
```

每篇文章都是 `.md` 普通文本。网站程序由 Astro 在背后把 Markdown 变成网页，不需要你学习 React，也不需要维护服务器。

结构化 Claim 在 `src/data/claims/`，公司资料索引、Evidence 与风险在 `src/data/companies/`。同一条 Claim 只保存一份，网页会自动读取。

## 本地查看

第一次使用，在项目文件夹中运行：

```bash
npm install
npm run dev
```

然后打开：

```text
http://localhost:3000
```

修改 Markdown 后，网页会自动刷新。结束时可在终端按 `Control + C`。

## 发布到 GitHub Pages

项目已经包含 `.github/workflows/deploy.yml`。第一次发布需要：

1. 在 GitHub 新建一个仓库，例如 `investment-research-lab`；
2. 把这个文件夹连接到该仓库并推送到 `main`；
3. 在 GitHub 仓库进入 **Settings → Pages**；
4. 在 **Build and deployment → Source** 选择 **GitHub Actions**。

以后每次研究更新只需要：

```bash
git add .
git commit -m "update muyuan research"
git push
```

GitHub Actions 会自动安装依赖、构建静态网页并发布 `dist/`。项目会自动适配 `username.github.io/repository/` 子路径。

注意：当前工作区只完成了发布配置，**尚未上传到 GitHub，也没有公开网站**。只有你明确决定仓库和可见范围后再执行发布。

## 添加一家公司

以“公司英文短名”为目录名，例如 `maotai`：

1. 复制 `src/content/companies/muyuan/` 为 `src/content/companies/maotai/`；
2. 保留 00–15 对应文件名，修改每篇 frontmatter 的标题、描述、状态和日期；
3. 在 `src/data/companies/` 新建 `maotai.json`，填写身份、经济模型、Evidence、风险和来源；
4. 在 `src/data/claims/` 新建 `maotai.yaml`，至少写一个可证伪的 OPEN Claim；
5. 为新公司创建 `src/pages/companies/maotai/` 页面入口；
6. 把公司卡加入 `src/pages/index.astro`；
7. 运行 `npm run check`、`npm test`，确认后再推送。

接入门槛：一句话经济模型、一个可证伪 Claim、Evidence Ledger、风险观察信号、原始来源索引，以及 Overview / First Principles / Thesis / Evidence / Risks 五个最小页面。

## 研究纪律

- `FACT` 必须能回到原始来源；
- `INFERENCE` 必须写清从事实到解释的推理；
- `HYPOTHESIS` 必须绑定 Claim 并允许被反证；
- 置信度由本人更新，不由 AI 自动提高；
- 最终投资判断统一为 `Human-written only`。

原始年报继续保存在 KnowledgeBase，不复制进网站：

```text
/Users/dufresne/knowledgebase/KnowledgeBase/10_Inputs/investment/annual_reports/
```

## 常用检查

```bash
npm run check   # 检查内容与页面类型
npm run build   # 生成纯静态网页到 dist/
npm test        # 构建并检查路由、链接和研究边界
```

架构规则见 [docs/architecture.md](docs/architecture.md)，本次迁移记录见 [docs/migration-plan.md](docs/migration-plan.md)。
