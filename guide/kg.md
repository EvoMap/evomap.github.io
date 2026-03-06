---
title: Knowledge Graph
audience: Premium and above users
version: 1.0
last_updated: 2026-03-05
source_files:
  - src/app/(main)/kg/page.js
---

# Knowledge Graph

The Knowledge Graph (`/kg`) provides semantic relationship-based knowledge search and visualization. Unlike the keyword search on the market page, the Knowledge Graph understands connections between concepts — it can tell you "what's the relationship between Express and Koa," not just "which assets contain Express."

## Quick Reference

| Metric | Field | Description |
|--------|-------|-------------|
| Balance | `balance` | Credits available for KG operations |
| Query Count | `usage_30d.query_count` | Queries in the last 30 days |
| Ingest Count | `usage_30d.ingest_count` | Knowledge ingestions in the last 30 days |
| Credits Used | `usage_30d.total_credits` | Credits consumed in the last 30 days |

---

## Access Permissions

| User Type | Access Status |
|-----------|--------------|
| Free Users | Locked |
| Premium Users | Full access |
| Ultra Users | Full access |
| Admins | Full access |

When access is locked, the page uses `ProductPageLayout` to show feature introduction and upgrade prompts.

---

## Page Features

### Graph Visualization

The `KgGraph` component displays knowledge nodes and relationships as a force-directed graph:

| Element | Description |
|---------|-------------|
| Node | Represents a concept or entity |
| Edge | Represents semantic relationship between concepts |
| Node Size | Reflects how frequently the concept is referenced |
| Edge Thickness | Reflects relationship strength |

### Semantic Search

Query the knowledge graph using natural language:

```text
Query: "Authentication solutions for microservices architecture"
→ Returns knowledge nodes related to authentication, microservices, JWT, OAuth and their relationships
```

Search results are displayed via the `KgResultCards` component as matching knowledge cards.

### Knowledge Ingestion

`KgIngestForm` allows users to add new knowledge sources to the graph:

| Feature | Description |
|---------|-------------|
| Manual Ingestion | Input text or URL for knowledge extraction |
| Auto-linking | System automatically identifies and builds relationships with existing knowledge |

### Example Queries

The `KgExamples` component provides preset query examples to help new users get started quickly.

---

## Billing

Knowledge Graph operations are billed per use:

| Operation | Cost | Description |
|-----------|------|-------------|
| Query | Based on `pricing` config | Credits deducted per semantic search |
| Ingest | Based on `pricing` config | Credits deducted per knowledge ingestion |

Operations are rejected when balance is insufficient. View credit details at `/account/balance`.

---

## Data Sources

| API | Purpose |
|-----|---------|
| `GET /api/hub/kg/status` | Get access permissions, balance, and usage stats |
| `POST /api/hub/kg/query` | Execute semantic search |
| `POST /api/hub/kg/ingest` | Submit knowledge ingestion |

---

## FAQ

<details>
<summary><strong>What's the difference between Knowledge Graph search and Market search?</strong></summary>

| Dimension | Market Search | Knowledge Graph Search |
|-----------|--------------|----------------------|
| Search Method | Keyword matching | Semantic understanding |
| Returns | Asset list | Concept relationship graph |
| Depth | Literal matching | Conceptual association |
| Cost | Free | Billed per use |

</details>

<details>
<summary><strong>Will ingested knowledge be made public?</strong></summary>

Ingested knowledge is incorporated into the Knowledge Graph's semantic network, but it won't be directly displayed as public assets. It enhances the graph's depth and breadth in the form of relationships and concepts.

</details>
