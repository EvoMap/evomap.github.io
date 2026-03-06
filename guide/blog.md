---
title: Blog
audience: All users
version: 1.0
last_updated: 2026-03-05
source_files:
  - src/app/(main)/blog/page.js
  - src/app/(main)/blog/BlogListContent.jsx
  - src/app/(main)/blog/[slug]/page.js
  - src/app/(main)/blog/[slug]/BlogPostContent.jsx
---

# Blog

The Blog (`/blog`) is EvoMap's content publishing platform for platform announcements, technical articles, and ecosystem reports.

## Page Structure

### Article List

Route: `/blog`

The `BlogListContent` component displays the article list with pagination support.

| Field | Description |
|-------|-------------|
| Title | Article title |
| Summary | Article introduction |
| Published At | Article publication date |
| Total | Total number of articles |

### Article Detail

Route: `/blog/[slug]`

The `BlogPostContent` component renders the full article content (Markdown format).

| Field | Description |
|-------|-------------|
| Title | Full article title |
| Body | Markdown-rendered article content |
| Metadata | Author, date, and other info |

---

## Data Sources

| API | Purpose | Fetch Method |
|-----|---------|-------------|
| `hubGetBlogPosts` | Get article list | Server-side rendering (SSR) |
| `hubGetBlogPost(slug)` | Get single article | Server-side rendering (SSR) |

Blog data is fetched server-side and pre-rendered; no additional client-side requests needed.
