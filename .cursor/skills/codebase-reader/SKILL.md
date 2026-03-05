---
name: codebase-reader
description: >
  Fetch and navigate EvoMap platform source code from GitHub. Use when the user
  says "获取前端", "前端代码", "查前端", "看前端", "website代码" to clone
  EvoMap/evomap-website, or "获取后端", "后端代码", "查后端", "看后端",
  "hub代码" to clone EvoMap/evomap-hub. Also activate when the user asks about
  EvoMap platform implementation details like "这个接口怎么实现的", "这个页面
  怎么写的", or references any EvoMap repo by name — even if they just say
  "帮我查一下代码" in the context of EvoMap development (in any language).
version: 1.0.0
---

# EvoMap Codebase Reader

Fetch, navigate, and answer questions about EvoMap's source code repositories.
Maps shorthand phrases to the correct GitHub repo, clones it locally, and
provides a ready-to-query codebase so subsequent questions can be answered
with real code — not guesses.

## When to activate

- User says "获取前端", "前端代码", "前端源码", "查前端", "看前端", "website 代码"
- User says "获取后端", "后端代码", "后端源码", "查后端", "看后端", "hub 代码"
- User asks about EvoMap platform code, routes, components, APIs, services
- User mentions "evomap-website", "evomap-hub", or any EvoMap repo by name
- User asks "这个接口怎么实现的", "这个页面怎么写的" and the context is EvoMap

---

## Repository map

| Shorthand | Repository | Local clone path | Stack |
|-----------|-----------|-----------------|-------|
| **前端** / frontend / website | `EvoMap/evomap-website` | `E:/temp/evomap-website` | Next.js (App Router), Tailwind, RTK Query, next-intl |
| **后端** / backend / hub | `EvoMap/evomap-hub` | `E:/temp/evomap-hub` | Express, Prisma, PostgreSQL, Redis, BullMQ |

Both repos are public on GitHub and accessible via `git clone`.

---

## Workflow

### Phase 1 — Identify target repo

Parse the user's message against the shorthand table above.

```
User says "前端" or related keywords?
├─ Yes → target = EvoMap/evomap-website
└─ No → User says "后端" or related keywords?
    ├─ Yes → target = EvoMap/evomap-hub
    └─ No → Ask the user which repo they mean
```

If the user mentions both (e.g., "前端调后端的接口"), fetch both repos.

### Phase 2 — Clone or verify local copy

Check if the repo already exists at the local clone path:

```
Does E:/temp/{repo-name} exist and contain a .git directory?
├─ Yes → Run `git -C <path> pull` to get latest changes
└─ No  → Run `git clone --depth 1 https://github.com/EvoMap/{repo}.git E:/temp/{repo-name}`
```

`--depth 1` keeps the clone fast. If the user explicitly asks for git history
or blame, re-clone without `--depth 1`.

**Fallback**: If `git clone` fails (network issue, auth), inform the user and
suggest they clone manually or check their network connection.

### Phase 3 — Navigate and answer

Once the codebase is available locally, use standard tools (Grep, Glob, Read)
to find and read the relevant code. Common navigation patterns:

| User wants | Where to look (frontend) | Where to look (backend) |
|-----------|-------------------------|------------------------|
| Page / route | `src/app/(main)/**/page.js` | — |
| Component | `src/components/**/*.jsx` | — |
| API route (BFF) | `src/app/api/**/route.js` | — |
| Backend endpoint | — | `src/routes/**/*.js` |
| Service logic | — | `src/services/*Service.js` |
| Data model | — | `prisma/schema.prisma` |
| Navigation | `src/components/layout/NavLinks.jsx` | — |
| Config | `next.config.mjs`, `tailwind.config.js` | `src/app.js`, `config/` |
| i18n text | `src/locales/{lang}/*.json` | — |
| Store / state | `src/store/**/*.js` | — |
| Middleware | `src/proxy.js` (Edge middleware) | `src/middleware/**/*.js` |

When answering, always cite the actual file path and line numbers so the user
can verify.

---

## Rules

1. **Always clone before answering code questions.** Do not guess or fabricate
   code from memory. The repos evolve frequently — stale knowledge is worse
   than admitting "let me fetch that first."

2. **Use `--depth 1` by default.** Full history is rarely needed and wastes
   time and disk. Only fetch full history when the user explicitly needs
   git log, blame, or diff across commits.

3. **Pull before answering if the clone already exists.** A stale local copy
   can mislead. A quick `git pull` takes seconds and ensures accuracy.

4. **Cite file paths and line numbers.** Every code snippet in your answer
   should reference the source file so the user can cross-check.

5. **Don't load entire large files into context.** Files like `a2aService.js`
   can exceed 100K characters. Use Grep to locate the relevant function first,
   then Read with offset/limit to fetch only what's needed.

6. **Respond in the user's language.** Follow the user's language preference
   for explanations. Code stays as-is.

---

*EvoMap Codebase Reader v1.0.0*
