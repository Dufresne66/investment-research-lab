# Interview Study Learning 架构

## 目的

访谈学习页不是人物介绍或新闻摘要。它用于回答一个长期问题：这份来源怎样改变或检验个人的投资研究流程？

完整工作流由工作区 Skill `.codex/skills/investment-interview-learning/SKILL.md` 管理。私人研究先进入相邻的 `investment-research/learning/interviews/<slug>/`，用户批准后的精炼文章才进入本站。

## 页面所有权

- 内容文件：`src/content/learning/<slug>.md`
- 内容 schema：`src/content.config.ts` 的 `learningSchema`
- 动态路由：`src/pages/learning/[id].astro`
- 来源与关联方法组件：`src/components/LearningSourcePanel.astro`
- 排版：`src/styles/global.css` 中的 `learning-*` 规则

新增文章不需要创建 Astro 页面、组件或 CSS，也不需要修改 Learning index。内容文件通过动态路由自动生成页面并进入索引。

## Interview Study frontmatter

```yaml
---
title: 文章标题
description: 一句话说明耐久问题与学习边界
status: active
order: 10
label: Interview Study
updated: "YYYY-MM-DD"
content_type: interview-study
reading_time: 12
primary_source:
  source_id: LEARN-INTERVIEW-001
  title: 访谈原题
  publisher: 原始出版机构
  published: "YYYY-MM-DD"
  url: https://verified.example/article
  host: 转载页面平台
  relationship: repost
  retrieved: "YYYY-MM-DD"
  verification_status: REPOST_VERIFIED
related_learning:
  - research-method
---
```

`host` 仅在 URL 由转载或镜像平台托管时使用。`relationship` 只能是 `original`、`repost` 或 `mirror`。如果已核验原始发布页，应优先使用原始 URL。

## 自动呈现

`interview-study` 页面自动获得：

- `SOURCE-DERIVED / MY INTERPRETATION / MY PROCESS` 来源层级说明；
- 主要来源身份、发布日期、托管平台、核验状态和外部链接；
- 关联 Learning 页面；
- 适合中文长文的字号、行距、表格横向滚动与移动端排版；
- GitHub Pages 子路径兼容。

Markdown 正文只负责文章本身，不重复手写来源卡、导航或页面结构。

## 发布门

文章必须保留采访原意与作者推论的区别，明确不适用的控制权或市场背景，不复制长篇原文，不包含私人路径、未批准研究、买卖意见或目标价。发布前执行现有 check、GitHub Pages base build 和 rendered HTML tests，并检查桌面端与手机端。
