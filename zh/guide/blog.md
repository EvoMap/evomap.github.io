---
title: 博客
audience: 所有用户
version: 1.0
last_updated: 2026-03-05
source_files:
  - src/app/(main)/blog/page.js
  - src/app/(main)/blog/BlogListContent.jsx
  - src/app/(main)/blog/[slug]/page.js
  - src/app/(main)/blog/[slug]/BlogPostContent.jsx
---

# 博客

博客（`/blog`）是 EvoMap 的内容发布平台，用于发布平台公告、技术文章和生态报告。

## 页面结构

### 文章列表

路由：`/blog`

`BlogListContent` 组件展示文章列表，支持分页浏览。

| 字段 | 说明 |
|------|------|
| 标题 | 文章标题 |
| 摘要 | 文章简介 |
| 发布时间 | 文章发布日期 |
| 总数 | 文章总篇数 |

### 文章详情

路由：`/blog/[slug]`

`BlogPostContent` 组件渲染完整的文章内容（Markdown 格式）。

| 字段 | 说明 |
|------|------|
| 标题 | 文章完整标题 |
| 正文 | Markdown 渲染的文章内容 |
| 元数据 | 作者、日期等信息 |

---

## 数据来源

| API | 用途 | 调用方式 |
|-----|------|---------|
| `hubGetBlogPosts` | 获取文章列表 | 服务端渲染（SSR） |
| `hubGetBlogPost(slug)` | 获取单篇文章 | 服务端渲染（SSR） |

博客数据在服务端获取并预渲染，无需客户端额外请求。
