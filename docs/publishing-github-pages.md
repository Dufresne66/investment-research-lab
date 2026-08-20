# 把 Investment Research Lab 发布到 GitHub Pages

当前网站已经准备好自动发布流程，但本地项目还没有连接任何 GitHub 仓库。第一次发布只需完成以下步骤。

## 发布前先理解一件事

GitHub Pages 是公开网页。即使某些付费方案允许从私有仓库构建，普通 Pages 网站仍可能公开访问。不要把个人隐私、账户信息、未授权 PDF 或其他敏感资料放进网站仓库。

本项目只保存研究文章、结构化判断和原始资料路径，不上传 KnowledgeBase 中的年报 PDF。

## 第一步：建立 GitHub 仓库

1. 登录 GitHub；
2. 点击右上角 `+`，选择 **New repository**；
3. 仓库名建议填写 `investment-research-lab`；
4. 第一次发布建议选择 **Public**；
5. 不勾选自动创建 README、`.gitignore` 或 License；
6. 点击 **Create repository**。

创建后会得到类似地址：

```text
https://github.com/<你的用户名>/investment-research-lab
```

## 第二步：连接并上传当前网站

最简单的方法是把上面的仓库地址发给 Codex，并说：

```text
请把当前 Investment Research Lab 连接到这个 GitHub 仓库并推送 main，
但不要修改研究内容：<仓库地址>
```

如果自己操作，对应步骤是：

```bash
git remote add origin https://github.com/<你的用户名>/investment-research-lab.git
git push -u origin main
```

## 第三步：打开 GitHub Pages

1. 进入刚才的 GitHub 仓库；
2. 点击 **Settings**；
3. 左侧点击 **Pages**；
4. 在 **Build and deployment** 中，把 **Source** 设为 **GitHub Actions**。

项目里的 `.github/workflows/deploy.yml` 会在每次推送 `main` 后自动构建和发布。

## 第四步：找到公开网址

回到仓库的 **Actions** 页面，等待 `Deploy to GitHub Pages` 变成绿色。第一次通常需要几分钟。

网址通常是：

```text
https://<你的用户名>.github.io/investment-research-lab/
```

这个地址可以直接发给其他人打开。

## 以后如何更新

平时只需继续写 Markdown。完成一次学习后：

```bash
git add .
git commit -m "update investment research"
git push
```

GitHub Pages 会自动更新，不需要重新设置。

## 如果发布失败

依次检查：

1. 仓库默认分支是否是 `main`；
2. **Settings → Pages → Source** 是否选择 GitHub Actions；
3. **Actions** 页面中失败步骤的提示；
4. 仓库是否包含 `pnpm-lock.yaml` 和 `.github/workflows/deploy.yml`。

本项目会根据 GitHub 用户名和仓库名自动设置网页根地址，不需要手动修改 `astro.config.mjs`。
