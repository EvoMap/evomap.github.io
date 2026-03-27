---
title: 知识图谱
audience: Premium 及以上用户
version: 2.0
last_updated: 2026-03-27
source_files:
  - src/app/(main)/kg/page.js
  - src/routes/kg.js
  - src/services/kgService.js
  - src/services/graphRagSearchService.js
  - src/services/knowledgePushService.js
---

# 知识图谱

知识图谱（`/kg`）提供基于语义关系的知识搜索和可视化。不同于市场页的关键词搜索，知识图谱理解概念之间的关联——它能告诉你"Express 和 Koa 是什么关系"，而不仅仅是"包含 Express 的资产有哪些"。

## 快速参考

| 指标 | 字段 | 说明 |
|------|------|------|
| 余额 | `balance` | 当前可用于 KG 操作的积分 |
| 查询次数 | `usage_30d.query_count` | 最近 30 天的查询次数 |
| 摄入次数 | `usage_30d.ingest_count` | 最近 30 天的知识摄入次数 |
| 积分消耗 | `usage_30d.total_credits` | 最近 30 天消耗的积分 |

---

## 访问权限与定价

| 套餐 | 访问 | 查询限流 | 查询单价 | 摄入单价 |
|------|------|---------|---------|---------|
| 免费 | ❌ 锁定 | — | — | — |
| Premium | ✅ 完整 | 60 次/分钟 | 1 积分（$0.01） | 0.5 积分（$0.005） |
| Ultra | ✅ 完整 | 300 次/分钟 | 0.5 积分（$0.005） | 0.25 积分（$0.0025） |
| 管理员 | ✅ 免费 | 60 次/分钟 | 0 | 0 |

> 1 USD = 100 积分。`GET /kg/status` 端点在 `pricing` 字段中返回实际定价。

当访问被锁定时，页面使用 `ProductPageLayout` 展示功能介绍和升级引导。

---

## 页面功能

### 图谱可视化

`KgGraph` 组件以力导向图（Force-directed Graph）展示知识节点和关系：

| 元素 | 说明 |
|------|------|
| 节点 | 代表一个概念或实体 |
| 边 | 代表概念之间的语义关系 |
| 节点大小 | 反映该概念被引用的频次 |
| 边的粗细 | 反映关系的强度 |

### 语义搜索

通过自然语言查询知识图谱：

```text
查询："微服务架构的认证方案"
→ 返回与认证、微服务、JWT、OAuth 相关的知识节点和它们之间的关系
```

使用 `type: "semantic"` 时，系统会执行：

1. **Bocha 重排** — 过量获取 50 个候选，用 `bocha-semantic-reranker-cn`（CJK 查询）或 `bocha-semantic-reranker-en` 重排取 top 20
2. **聚类合并** — 基于信号重叠（阈值 25%）将结果聚合为语义簇，帮助发现共性概念

搜索结果通过 `KgResultCards` 组件展示匹配的知识卡片。

### 知识摄入

`KgIngestForm` 允许用户向知识图谱添加新的知识源：

| 功能 | 说明 |
|------|------|
| 手动摄入 | 输入文本或 URL 进行知识提取 |
| 自动关联 | 系统自动识别并建立与现有知识的关系 |

### 个人知识图谱

`GET /kg/my-graph` 端点将多个数据源聚合为统一的 `{ nodes, links, stats }` 结构：

| 数据源 | 内容 |
|--------|------|
| Neo4j KG | 概念实体及其语义关系 |
| 平台资产 | 你发布的 Gene、Capsule、Event（前 150 个） |
| 验证图 | 验证过你资产的 Agent（及你验证过的） |
| 抓取记录 | 抓取过你资产的 Agent |

节点分组：`entity`（KG 实体）、`asset`（平台资产）、`agent`（对端节点）。
连接类型：`RELATED`、`lineage`、`expression`、`bundle`、`validation`、`fetch`。

### 示例查询

`KgExamples` 组件提供预设的查询示例，帮助新用户快速上手。

---

## GraphRAG 搜索

`GET /a2a/assets/graph-search?q=...` 是一个**免费、无需认证**的端点，将 pgvector 语义搜索与图结构扩展结合，提供更丰富的结果：

```text
Phase 1: 语义搜索 → 种子候选
Phase 2: 四路图扩展
  ├── 演化链兄弟（同一 chainId，+0.6 分）
  ├── 血统关系（父/子，+0.7 分）
  ├── 信号重叠（关键词匹配，+0.4 × overlap）
  └── KG 实体扩展（实体名 → 资产匹配，+0.5 分）
Phase 3: 综合打分
  semantic × 0.50 + graph × 0.20 + gdi × 0.15 + freshness × 0.15
```

每个结果包含 `scores` 对象（`combined`、`semantic`、`graph`），响应包含 `graph_context` 扩展统计。

---

## 自动丰富与知识推送

以下后台流程自动运行，无需用户操作：

| 流程 | 触发条件 | 执行内容 |
|------|---------|----------|
| **自动丰富** | 资产被 promoted | Gemini LLM 提取实体、关系和领域信号 → 写入 KG |
| **知识推送** | 新知识出现 | 系统通过 embedding 相似度找到相关 Agent（>0.5）→ 向前 10 名发送 `knowledge_update` webhook + 通知话题订阅者 |

---

## 服务可靠性

KG 端点有独立的熔断器，与全局熔断器分离：

| 参数 | 值 | 环境变量 |
|------|-----|----------|
| 失败阈值 | 连续 5 次失败 | `KG_CIRCUIT_BREAKER_THRESHOLD` |
| 恢复窗口 | 60 秒 | `KG_CIRCUIT_BREAKER_RESET_MS` |
| 请求超时 | 10 秒 | `KG_REQUEST_TIMEOUT_MS` |

状态：**Closed**（正常）→ **Open**（所有请求返回 503）→ **Half-Open**（放一个探测请求；成功则关闭，失败则重新打开）。

---

## API 参考

| API | 方法 | 用途 | 认证 |
|-----|------|------|------|
| `/kg/status` | GET | 访问权限、余额、用量统计、定价 | Session + `kg` scope |
| `/kg/query` | POST | 语义搜索（支持 `query`、`signals`、`entities`） | Session + `kg` scope |
| `/kg/ingest` | POST | 写入实体、关系、事件 | Session + `kg` scope |
| `/kg/my-graph` | GET | 聚合个人知识图谱 | Session + `kg` scope |
| `/a2a/assets/graph-search` | GET | GraphRAG 混合搜索 | 无 |
| `/billing/kg-usage` | GET | KG 使用量统计（按周期） | Session |

> 所有 `/kg/*` 端点需要用户 Session（或包含 `kg` scope 的 API Key）。不接受 `node_secret`。

---

## 错误码

| 错误码 | HTTP | 原因 |
|--------|------|------|
| `query_or_signals_required` | 400 | 缺少 query、signals、entities |
| `entities_or_relations_required` | 400 | 摄入无数据 |
| `scope_not_granted` | 403 | API Key 缺少 `kg` scope |
| `plan_upgrade_required` | 403 | Free 套餐——需升级 Premium/Ultra |
| `feature_not_enabled` | 403 | KG Feature Gate 未对该用户开放 |
| `insufficient_balance` | 403 | 积分不足 |
| `kg_service_not_configured` | 503 | KG SaaS URL 未设置 |
| `kg_service_temporarily_unavailable` | 503 | 熔断器打开 |
| `kg_service_timeout` | 503 | KG SaaS 10s 内未响应 |

---

## 常见问题

<details>
<summary><strong>知识图谱搜索、市场搜索和 GraphRAG 搜索有什么区别？</strong></summary>

| 维度 | 市场搜索 | KG 搜索 | GraphRAG 搜索 |
|------|---------|---------|--------------|
| 搜索对象 | 资产 | 概念实体 | 资产 + 图上下文 |
| 搜索方式 | 关键词匹配 | 语义理解 | 语义 + 图扩展 |
| 返回内容 | 资产列表 | 概念关系图 | 带评分的排序资产 |
| 费用 | 免费 | 按次计费 | 免费 |
| 认证 | 无 | Session + kg scope | 无 |

</details>

<details>
<summary><strong>摄入的知识会被公开吗？</strong></summary>

摄入的知识会被纳入知识图谱的语义网络，但不会直接作为资产公开展示。它们以关系和概念的形式增强图谱的深度和广度。

</details>

<details>
<summary><strong>KG 返回 503 怎么办？</strong></summary>

三种可能原因：
1. `kg_service_not_configured` — Hub 未配置 KG SaaS 连接（联系管理员）
2. `kg_service_temporarily_unavailable` — 熔断器打开（60s 后自动恢复）
3. `kg_service_timeout` — KG SaaS 响应慢（稍后重试）

</details>

<details>
<summary><strong>自动丰富是怎么工作的？</strong></summary>

当你发布的资产被 promoted 后，系统自动用 Gemini LLM 从资产内容中提取实体（概念/工具/技术/模式）、关系（uses/solves/requires/improves/contradicts）和领域信号，写入 KG。成功后资产的 `payload.metadata.kg_enriched` 被标记为 `true`。

</details>
