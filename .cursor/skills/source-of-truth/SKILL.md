---
name: source-of-truth
description: >
  The single gateway to all authoritative EvoMap knowledge: two source code
  repos and the official Wiki API. Use when the user says "获取前端", "前端代码",
  "查前端", "看前端", "website代码" to clone EvoMap/evomap-website, or "获取后端",
  "后端代码", "查后端", "看后端", "hub代码" to clone EvoMap/evomap-hub. Also
  activate when the user asks about EvoMap platform implementation details
  like "这个接口怎么实现的", "这个页面怎么写的", or references any EvoMap repo
  by name — even if they just say "帮我查一下代码" in the context of EvoMap
  development (in any language). Also activate when the user asks about EvoMap
  concepts, architecture, protocols, or any domain knowledge — e.g. "什么是
  Evolution Capsule", "wiki", "文档", "Gene 是什么", "A2A 协议".
version: 2.1.0
---

# EvoMap Source of Truth

The single gateway to all authoritative EvoMap knowledge. Fetches source code
from GitHub repos and queries the official Wiki API — so every answer is
grounded in real code and authoritative documentation, never guesses.

## When to activate

- User says "获取前端", "前端代码", "前端源码", "查前端", "看前端", "website 代码"
- User says "获取后端", "后端代码", "后端源码", "查后端", "看后端", "hub 代码"
- User asks about EvoMap platform code, routes, components, APIs, services
- User mentions "evomap-website", "evomap-hub", or any EvoMap repo by name
- User asks "这个接口怎么实现的", "这个页面怎么写的" and the context is EvoMap
- User asks about EvoMap concepts, architecture, protocols, or domain knowledge
  (e.g. "什么是 Gene", "Capsule 怎么用", "wiki", "文档", "A2A 协议",
  "Evolution Sandbox", "GEP", "Swarm", "Credit Marketplace")

---

## Single source of truth

EvoMap has exactly **three** authoritative sources. All answers MUST come from
one (or more) of these — never from training data or assumptions:

| Source | Type | How to access |
|--------|------|---------------|
| `EvoMap/evomap-website` | Frontend code | `git clone` → `E:/temp/evomap-website` |
| `EvoMap/evomap-hub` | Backend code | `git clone` → `E:/temp/evomap-hub` |
| **Official Wiki API** | Concepts & docs | `GET https://evomap.ai/api/docs/wiki-full?lang={lang}&format=json` |

If information cannot be found in any of these three sources, say so explicitly.
Do NOT fill gaps with speculation.

---

## Repository map

| Shorthand | Repository | Local clone path | Stack |
|-----------|-----------|-----------------|-------|
| **前端** / frontend / website | `EvoMap/evomap-website` | `E:/temp/evomap-website` | Next.js (App Router), Tailwind, RTK Query, next-intl |
| **后端** / backend / hub | `EvoMap/evomap-hub` | `E:/temp/evomap-hub` | Express, Prisma, PostgreSQL, Redis, BullMQ |

Both repos are public on GitHub and accessible via `git clone`.

---

## Wiki API

The official EvoMap Wiki is served as a JSON API.

### Endpoint

```
GET https://evomap.ai/api/docs/wiki-full?lang={lang}&format=json
```

- `lang` — `en` (English) or `zh` (Chinese). Match the user's language.
- `format` — always `json`.

### Response schema

```json
{
  "lang": "en",
  "count": 27,
  "docs": [
    { "slug": "00-introduction", "content": "# Introduction to EvoMap\n..." },
    { "slug": "01-quick-start",  "content": "..." }
  ]
}
```

Each element in `docs` has:
- `slug` — unique identifier (e.g. `05-a2a-protocol`)
- `content` — full Markdown text of that wiki page

### Available wiki pages (slug index)

| Slug | Topic |
|------|-------|
| `00-introduction` | Vision, core modules overview |
| `01-quick-start` | Getting started guide |
| `02-for-human-users` | Human user guide |
| `03-for-ai-agents` | AI agent integration guide |
| `05-a2a-protocol` | Agent-to-Agent protocol |
| `06-billing-reputation` | Billing & reputation system |
| `07-playbooks` | Playbooks |
| `08-faq` | Frequently asked questions |
| `09-research-context` | Research context |
| `10-swarm` | Swarm intelligence |
| `11-evolution-sandbox` | Evolution Sandbox |
| `12-ecosystem` | Ecosystem overview |
| `13-verifiable-trust` | Verifiable trust |
| `14-manifesto` | Manifesto |
| `15-reading-engine` | Reading Engine |
| `16-gep-protocol` | GEP Protocol |
| `17-credit-marketplace` | Credit Marketplace |
| `18-life-ai-parallel` | Life–AI parallel |
| `19-recipe-organism` | Recipe Organism |
| `20-knowledge-graph` | Knowledge Graph |
| `21-anti-hallucination` | Anti-hallucination |
| `22-validator-staking` | Validator & Staking |
| `23-constitution` | Constitution |
| `24-ethics-committee` | Ethics Committee |
| `25-round-table` | Round Table |
| `26-ai-council` | AI Council |
| `27-ai-navigation` | AI Navigation |

---

## Workflow

### Phase 1 — Identify target source(s)

Parse the user's message to determine which sources are needed:

```
Question is about concepts, architecture, protocol design, or domain knowledge?
├─ Yes → need Wiki
└─ Also about implementation?
    └─ Yes → also need code repo(s)

User says "前端" or related keywords?
├─ Yes → target repo = EvoMap/evomap-website
└─ No → User says "后端" or related keywords?
    ├─ Yes → target repo = EvoMap/evomap-hub
    └─ No → Only Wiki needed? → proceed with Wiki only
         └─ No → Ask the user which repo they mean
```

If the user mentions both (e.g., "前端调后端的接口"), fetch both repos.
When in doubt, fetch the Wiki too — it's cheap and fast.

### Phase 2a — Fetch Wiki (when needed)

Use `WebFetch` to call the Wiki API:

```
https://evomap.ai/api/docs/wiki-full?lang={lang}&format=json
```

- Pick `lang=zh` if the user writes in Chinese, `lang=en` otherwise.
- The response is a single JSON with all 27 docs. Parse it to find the
  relevant `slug`(s) based on the user's question, then read their `content`.
- If the full response is too large to process at once, use the slug index
  (above) to identify relevant pages, then extract only those entries.

### Phase 2b — Clone or verify local copy (when code is needed)

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

Once the sources are available, use standard tools (Grep, Glob, Read) to find
and read the relevant code, and cite Wiki content for conceptual context.
Common navigation patterns:

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

1. **Three sources of truth only.** All answers MUST come from the two repos
   and/or the Wiki API. Do not guess or fabricate from training data. If
   information isn't in any of the three sources, say "I could not find this
   in the EvoMap sources."

2. **Always fetch before answering.** Clone/pull repos for code questions;
   call the Wiki API for concept/architecture questions. Stale knowledge is
   worse than admitting "let me fetch that first."

3. **Use `--depth 1` by default.** Full history is rarely needed and wastes
   time and disk. Only fetch full history when the user explicitly needs
   git log, blame, or diff across commits.

4. **Pull before answering if the clone already exists.** A stale local copy
   can mislead. A quick `git pull` takes seconds and ensures accuracy.

5. **Cite sources explicitly.** For code: cite file paths and line numbers.
   For Wiki: cite the slug (e.g. `wiki:05-a2a-protocol`). Every claim should
   be traceable.

6. **Don't load entire large files into context.** Files like `a2aService.js`
   can exceed 100K characters. Use Grep to locate the relevant function first,
   then Read with offset/limit to fetch only what's needed. For the Wiki,
   use the slug index to target specific pages.

7. **Respond in the user's language.** Follow the user's language preference
   for explanations. Code and Wiki quotes stay as-is.

8. **Cross-reference when possible.** If a concept from the Wiki maps to a
   specific implementation in the codebase, link both so the user gets the
   full picture (design intent + actual code).

---

*EvoMap Source of Truth v2.1.0*
