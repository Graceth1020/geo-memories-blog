# 足迹日志 · 复古胶片旅行日记

一本写在牛皮纸上的旅行手账：
- 🗺️ 中国地图 · 高亮已抵达的省份，按城市数着色，支持缩放/拖拽
- 📓 每篇文章 = 一个 `src/posts/*.md` 文件
- 📚 首页地图下方为文章列表，点击进入详情

## 添加一篇新游记

在 `src/posts/` 新建 `2025-xx-地点.md`，顶部加 frontmatter：

```md
---
title: 标题
date: 2025-01-01
province: 福建            # 用于在地图上点亮该省
location: 厦门 · 鼓浪屿   # "·" 之前的部分会作为城市名显示在地图上
cover: https://...
excerpt: 一句简短的引子
---

正文（标准 Markdown）...
```

重新构建即可，无需任何后端。

---

## 🚀 部署到 GitHub Pages

项目已内置完整的 GitHub Pages 支持：

### 1. Project site（推荐）`https://<user>.github.io/<repo>/`

把代码推到 GitHub 仓库的 `main` 分支即可，工作流
`.github/workflows/deploy.yml` 会自动：

- 注入正确的 `base="/<repo>/"`（来自 `GH_PAGES_BASE` 环境变量）
- 构建 `dist/`
- 通过 `actions/deploy-pages` 上线

首次使用需要在仓库 **Settings → Pages → Build and deployment → Source**
里选择 **GitHub Actions**。

### 2. User / Org site `https://<user>.github.io/`

把工作流里的：

```yaml
GH_PAGES_BASE: /${{ github.event.repository.name }}/
```

改成：

```yaml
GH_PAGES_BASE: /
```

并把 `public/404.html` 里的 `var segmentCount = 1;` 改为 `0`。

### 3. 自定义域名

设置 `GH_PAGES_BASE: /`，并在 `public/` 下放一个 `CNAME` 文件，内容为你的域名。

---

## 内置的 GitHub Pages 适配细节

- **`vite.config.ts`** 通过 `process.env.GH_PAGES_BASE` 动态设置 `base`
- **`src/App.tsx`** 用 `basename={import.meta.env.BASE_URL}` 让 React Router 适配子路径
- **`public/404.html`** 实现 SPA 深链接刷新：把路径编码进 query 后跳回 `index.html`
- **`src/main.tsx`** 启动时把 query 还原为真实路径再交给 React Router
- **`public/.nojekyll`** 关闭 Jekyll，避免 `_assets` 等被忽略

## 本地预览构建产物

```bash
GH_PAGES_BASE=/my-repo/ npm run build
npx serve dist
```
