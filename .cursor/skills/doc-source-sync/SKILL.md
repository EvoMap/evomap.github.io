---
name: doc-source-sync
description: >
  Detect documentation drift when source code changes, and synchronize Wiki
  docs accordingly. Activate when user says "同步文档", "检查文档", "文档过期了吗",
  "doc drift", "sync docs", "update docs from code" — or when the user mentions
  that frontend code has changed and documentation might be stale. Also activate
  proactively when reviewing a PR or commit that touches files referenced in any
  doc's source_files frontmatter.
version: 1.0.0
---

# Doc-Source Sync

Detect and resolve documentation drift by comparing EvoMap Wiki docs against
their referenced source code files. Every doc in the Wiki has a `source_files`
list in its YAML frontmatter — this skill uses that metadata to find stale docs
and update them.

Documentation drifts silently. A renamed prop, a new API field, or a removed
component can make an entire doc section wrong without anyone noticing. This
skill closes the loop by making source-to-doc traceability a first-class concern.

## When to activate

- User says "同步文档", "检查文档", "文档过期了吗", "对比代码和文档"
- User says "doc drift", "sync docs", "update docs from code"
- User mentions code changes and asks if documentation needs updating
- After a `git pull` of `evomap-website` that shows changed files
- When reviewing a PR that touches files listed in any doc's `source_files`

---

## Key concepts

### source_files frontmatter

Every Wiki doc (`guide/*.md`, `concepts/*.md`, `reference/*.md`) contains a
`source_files` array in its YAML frontmatter:

```yaml
---
title: 市场
source_files:
  - src/app/(main)/market/page.js
  - src/components/market/AssetsTab.jsx
  - src/components/market/RecipesTab.jsx
---
```

These paths are relative to the frontend repo root (`E:/temp/evomap-website`).
VitePress ignores unknown frontmatter keys, so users never see this metadata.

### Drift types

| Type | Description | Severity |
|------|-------------|----------|
| **Field drift** | A data field was added, renamed, or removed in the source | High — doc shows wrong info |
| **Component drift** | A component was renamed, split, or deleted | High — doc references non-existent code |
| **API drift** | An API endpoint path or response shape changed | High — doc shows wrong endpoint |
| **Metric drift** | A KPI formula, label, or data source changed | Medium — numbers don't match |
| **Layout drift** | Page tabs, sections, or navigation changed | Medium — doc structure is wrong |
| **Cosmetic drift** | Copy changes, icon swaps, minor styling | Low — doc is functionally correct |

---

## Workflow

### Phase 1 — Prepare

1. Ensure the frontend repo is available locally. If not, clone it:

```
Does E:/temp/evomap-website/.git exist?
├─ Yes → git -C E:/temp/evomap-website pull
└─ No  → git clone --depth 1 https://github.com/EvoMap/evomap-website.git E:/temp/evomap-website
```

2. Collect all Wiki docs that have `source_files` in their frontmatter:

```
Scan: guide/*.md, concepts/*.md, reference/*.md
Extract: frontmatter.source_files from each
Build: Map<doc_path, source_file_paths[]>
```

### Phase 2 — Detect changes

Two detection modes depending on user context:

**Mode A: Full scan** (user says "检查文档" or "sync docs")

For each doc, read every file in its `source_files` list. Compare the source
code against what the doc claims:

- Check that components, props, and data fields mentioned in the doc still
  exist in the source
- Check that API endpoints match the paths in the source
- Check that KPI labels and formulas match the source
- Check for new components, fields, or tabs not covered by the doc

**Mode B: Targeted scan** (user mentions specific code changes or a git diff)

1. Parse the changed files from git diff or user input
2. Find which docs reference those files (reverse lookup from source_files)
3. Read only the affected source files and their corresponding docs
4. Identify what specifically changed and whether the doc needs updating

### Phase 3 — Report

Present findings as a drift report table:

```markdown
## Doc Drift Report — {date}

| Doc | Source file | Drift type | Detail | Action needed |
|-----|-------------|-----------|--------|---------------|
| guide/market.md | AssetsTab.jsx | Field drift | New `trustTier` field added | Add to asset card fields table |
| guide/agents.md | useAgentsData.js | API drift | New `getNodeSymbiosis` endpoint | Document new symbiosis view |
| — | pricing/page.js | No drift | Unchanged since last sync | None |
```

### Phase 4 — Sync

For each drift item with action needed:

1. Read the full doc file
2. Read the changed source file(s)
3. Update the doc to reflect the current code state
4. Update `last_updated` in frontmatter to today's date
5. If source files changed (renamed/added/removed), update `source_files` list

After all updates, run `npx vitepress build` in the docs repo to verify no
broken links or build errors.

---

## Reverse lookup

To quickly find which docs are affected by a code change, use this mapping
approach:

```
Input:  changed file path (e.g., "src/components/market/AssetsTab.jsx")
Action: grep -r "AssetsTab.jsx" guide/*.md concepts/*.md reference/*.md
Output: list of docs that reference this file in their source_files
```

Alternatively, scan all frontmatter programmatically:

```
For each .md file in guide/, concepts/, reference/:
  Parse YAML frontmatter
  If source_files contains the changed path:
    Mark doc as potentially stale
```

---

## Updating source_files

When the source code is refactored (files renamed, split, or merged), update
the `source_files` list in affected docs:

| Code change | Doc action |
|-------------|-----------|
| File renamed | Update path in source_files |
| File split into two | Add new path, keep old if still relevant |
| File deleted | Remove path, find replacement if any |
| New page/component added | Consider whether existing doc covers it or a new doc is needed |

---

## Rules

1. **Always pull latest code before scanning.** Stale local clones produce
   false positives. Run `git pull` at the start of every sync session.

2. **Never remove source_files entries without checking.** A file might be
   renamed, not deleted. Search for the content in nearby files before removing
   a reference.

3. **Update last_updated when syncing.** Every doc edit must bump the
   `last_updated` field in frontmatter so readers know the doc is fresh.

4. **Preserve doc style.** The existing docs use a consistent style: tables for
   data, `<details>` for FAQ, front matter with audience and version. Match this
   style when adding or editing content.

5. **Report before editing.** Always show the drift report first and get user
   confirmation before making bulk changes. A false positive in detection is
   cheap; a false positive in editing corrupts the doc.

6. **Prioritize high-severity drift.** Field and API drift can mislead users.
   Fix those first, cosmetic drift can wait.

7. **Keep source_files minimal but complete.** List only files that directly
   inform the doc's content. Don't include transitive dependencies (e.g., a
   utility used by the page but not mentioned in the doc).

---

*Doc-Source Sync v1.0.0*
