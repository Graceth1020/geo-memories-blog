# 足迹日志 · 复古胶片旅行日记

一本写在牛皮纸上的旅行手账：
- 🗺️ 中国地图 · 高亮已抵达的省份
- 📓 每篇文章 = 一个 `src/posts/*.md` 文件
- 📚 首页地图下方为文章列表，点击进入详情

## 添加一篇新游记

1. 在 `src/posts/` 新建 `2025-xx-地点.md`
2. 顶部写 frontmatter：

```md
---
title: 标题
date: 2025-01-01
province: 福建        # 用于在地图上点亮
location: 厦门 · 鼓浪屿
cover: https://...
excerpt: 一句简短的引子
---

正文（标准 Markdown）...
```

3. 重新构建即可，无需任何后端。

## 部署到 GitHub Pages

```bash
npm run build
```

将 `dist/` 推送到仓库的 `gh-pages` 分支，或使用 GitHub Actions。
注意：如果部署到 `https://<user>.github.io/<repo>/`，需在 `vite.config.ts`
中加上 `base: "/<repo>/"`，并新增 `public/404.html`（内容复制自 `dist/index.html`）以支持 SPA 深链刷新。
