# Next.js / vinext → Astro 迁移方案

日期：2026-08-20  
回退点：Git commit `9c021b8` (`pre-astro-migration`)

## 1. 当前项目审计

当前网站是一个可工作的 vinext / React 静态研究原型：

- `app/` 负责首页、牧原详情路由与全局样式；
- `components/` 负责 React 页面和简易 MDX 渲染；
- `content/companies/muyuan/` 保存 5 篇牧原研究正文；
- `data/companies/muyuan.json` 保存 Claim、Evidence、风险和来源索引；
- `worker/`、`vite.config.ts` 与 `.openai/hosting.json` 服务于原托管方案；
- 依赖包含 React、vinext、RSC、Cloudflare、Tailwind 与多套 Vite 插件。

主要问题不是页面不能工作，而是日常写研究需要理解过多网站框架细节。长期核心资产应当是 Markdown 和结构化研究数据，不是 React 组件。

## 2. 迁移目标

- 使用 Astro 生成纯静态 HTML；
- 日常研究只修改 `src/content/` 与 `src/data/`；
- 保留稳定 URL、牧原既有正文、Claim / Evidence 边界和 Human-written only 规则；
- 采用接近个人学术主页的高密度、克制、阅读优先设计；
- 使用 GitHub Actions 发布 `dist/` 到 GitHub Pages；
- 不引入 React、数据库、服务端 API、登录、实时行情或 CMS。

## 3. 保留内容

- 牧原 Overview、First Principles、Thesis、Evidence、Risks 的全部有效正文；
- `Profit ≈ Q × W × (P − C)` 第一性原理模型；
- `FACT / INFERENCE / HYPOTHESIS` 分类；
- `MY-COST-001` 的 OPEN 状态、40% 人工置信度和待补证据；
- 2021–2025 年年度报告索引及 `PAGE_ANCHOR_NEEDED` 边界；
- 原有绿色研究工具气质中的克制、留白、证据链和人类最终判断原则；
- `public/og.png` 社交分享图片。

## 4. 替换与删除

迁移完成并验证后删除：

- `app/`、`components/*.tsx`、`lib/muyuan.ts`、`types/raw.d.ts`；
- `next.config.ts`、`next-env.d.ts`、vinext 专用 `vite.config.ts`；
- `worker/`、Cloudflare / Sites 托管配置；
- React、React DOM、RSC、vinext、Tailwind、Cloudflare、Next ESLint 与 React 插件依赖。

它们由 `src/pages/`、`src/layouts/`、Astro components、普通 CSS 和 GitHub Pages workflow 取代。

## 5. 目标目录与数据所有权

```text
src/
├── components/               # 无 React 的 Astro 视觉组件
├── content/
│   ├── companies/muyuan/     # 00–15 公司研究 Markdown
│   ├── learning/             # 投资理论学习
│   └── journal/              # 研究日志与复盘
├── data/
│   ├── companies/muyuan.json # 公司身份、模型、Evidence、风险、来源
│   └── claims/muyuan.yaml    # Claim 唯一结构化来源
├── layouts/
├── lib/
├── pages/
└── styles/
```

Claim 的 statement、status、confidence、证据引用和更新时间只保存在 `src/data/claims/muyuan.yaml`。Markdown 负责解释与思考，不再复制整套 Claim 字段。

## 6. URL 策略

- `/`：Investment Research Lab 首页；
- `/companies/muyuan/`：牧原研究入口；
- `/companies/muyuan/<section>/`：00–15 稳定研究章节；
- `/learning/`、`/journal/`：学习和研究日志索引。

所有内部链接都读取 Astro `BASE_URL`，兼容本地根路径和 `username.github.io/repository/` 项目路径。

## 7. 风险与验证

- GitHub Pages 子路径：用仓库名自动计算 `base`，再通过构建产物测试链接；
- Markdown 渲染：由 Astro 原生静态管线处理中文、列表、引用和代码块；
- 数学：第一版使用可复制的 Unicode 公式，不引入 KaTeX；若以后写 LaTeX 数学再增加静态 remark / rehype 插件；
- 内容遗漏：迁移后逐篇比对原 5 篇正文；
- 回退：任何问题都可回到 `9c021b8`，不重写 Git 历史。

完成门槛：`npm run build` 与静态 HTML 测试通过、无 React / Next.js 残留依赖、核心路由存在、中文与研究卡片在桌面和手机宽度下可读。
