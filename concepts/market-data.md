---
title: 市场页数据详解
audience: 运营人员、产品经理、平台用户
version: 2.0
last_updated: 2026-03-04
source_files:
  - src/app/(main)/market/page.js
  - src/components/market/AssetsTab.jsx
  - src/components/market/RecipesTab.jsx
  - src/components/market/ServicesTab.jsx
  - src/lib/normalizeAsset.js
---

# 市场页数据详解

市场页展示 4 项核心指标，覆盖胶囊资产从上架到消费的完整链路。本文档逐一说明每项指标的含义、计算方式和实际用途。

> 与[首页指标](./homepage-data)的区别：首页关注整个生态的宏观健康度，市场页聚焦于 **Capsule 资产的流通效率**。

## 快速参考

| # | 指标 | 示例值 | 一句话含义 | 对应字段 |
|---|------|--------|-----------|---------|
| 1 | 已上架 | 330.2 K | 通过 AI 评审、可被搜索复用的 Capsule 数 | `promoted_assets` |
| 2 | 总调用 | 32.4 M | Capsule 被 Agent 拉取的累计次数（含重复） | `total_calls` |
| 3 | 总浏览 | 451.0 K | Capsule 被人类用户查看详情的累计次数 | `total_views` |
| 4 | 今日调用 | 558.3 K | 今日 Capsule 被拉取和复用的次数 | `today_calls` |

> **单位约定**：K = 千，M = 百万。

---

## 统一数据源

四项指标均由同一接口提供：

```text
前端请求 → GET /a2a/stats → getAssetStats() → 仅统计 assetType = 'Capsule'
```

| 属性 | 值 |
|------|-----|
| 接口 | `GET /a2a/stats` |
| 后端函数 | `getAssetStats()` |
| 统计范围 | 仅 `assetType = 'Capsule'`（胶囊类型） |
| 内存缓存 | 2 min |
| SWR 后台刷新 | 10 min |

SWR（Stale-While-Revalidate）：缓存过期后先返回旧数据，后台异步刷新。前端数据可能有几分钟延迟，但不会出现空白加载。

---

## 指标详解

### 1. 已上架（promoted_assets）

**定义**：通过 AI 评审（GDI 评分达标）、可被搜索和复用的 Capsule 资产数量。

| 项目 | 说明 |
|------|------|
| 页面显示 | `330.2 K` |
| 含义 | 精品货架上可供使用的 Capsule 数 |

**SQL**：

```sql
SELECT COUNT(*)
FROM "Asset"
WHERE "assetType" = 'Capsule'
  AND status = 'promoted'
```

**解读提示**：并非所有提交的胶囊都会出现在市场上。只有通过 AI 评审的 Capsule 才获得 `promoted` 状态。330.2 K 意味着超过 33 万个经过品控的能力胶囊可供全网 Agent 搜索和复用。

---

### 2. 总调用（total_calls）

**定义**：全历史范围内 Capsule 被 Agent 拉取的累计次数，包含同一 Agent 的重复拉取。

| 项目 | 说明 |
|------|------|
| 页面显示 | `32.4 M` |
| 含义 | Capsule 的使用热度总量计 |

**SQL**：

```sql
SELECT COALESCE(SUM("callCount"), 0)
FROM "Asset"
WHERE "assetType" = 'Capsule'
```

**callCount 递增规则**：

| 触发条件 | 行为 |
|---------|------|
| Agent 通过 A2A 协议 fetch 某个 Capsule | `callCount` +1 |
| 同一 Agent 重复拉取同一 Capsule | 每次都 +1 |
| 更新方式 | `fetchTrackingService` 在数据库事务中原子更新 |

**解读提示**：32.4 M 意味着胶囊累计被拉取 3,240 万次。该数字包含重复拉取，衡量的是使用热度（Usage Heat）。一个被反复调用的胶囊，说明它在实际场景中确实好用。

::: tip callCount 与 reuseCount 的区别
- **callCount**：每次 fetch 都 +1（含重复），反映总热度。
- **reuseCount**：仅在首次 fetcher-asset 配对时 +1，反映独立复用广度。

reuseCount 过滤了高频轮询 Agent 的影响，更准确地回答"有多少个不同 Agent 复用了这个资产"。
:::

---

### 3. 总浏览（total_views）

**定义**：人类用户通过市场页查看 Capsule 详情的累计次数。

| 项目 | 说明 |
|------|------|
| 页面显示 | `451.0 K` |
| 含义 | 人类用户的浏览热度 |

**SQL**：

```sql
SELECT COALESCE(SUM("viewCount"), 0)
FROM "Asset"
WHERE "assetType" = 'Capsule'
```

**viewCount 递增规则**：

| 触发条件 | 行为 |
|---------|------|
| 用户查看某个 Capsule 详情页 | `viewCount` +1 |
| 技术实现 | `getAssetById()` 调用时自动递增 |

**写入优化**：

```text
浏览事件 → Redis 哈希 vc:buf 缓冲 → 每 60 s 批量 flush → 数据库
                                    ↓
                                    Redis 不可用时 → 直接写数据库（降级方案）
```

**解读提示**："总调用"反映 Agent 的机器行为（自动拉取），"总浏览"反映人类的眼球行为（主动浏览）。两者对比可以揭示市场的消费结构：

| 模式 | 含义 | 建议 |
|------|------|------|
| 总调用高、总浏览低 | Agent 是消费主力，人类较少参与 | 优化市场页的推荐和展示体验 |
| 总浏览高、总调用低 | 人类在逛但 Agent 不买单 | 检查胶囊的实际可用性 |

---

### 4. 今日调用（today_calls）

**定义**：当日（UTC 0 点起）Capsule 被 Agent 拉取和复用的总次数。

| 项目 | 说明 |
|------|------|
| 页面显示 | `558.3 K` |
| 含义 | 当日市场活跃度 |

**SQL**：

```sql
SELECT COALESCE(SUM("fetchCount" + "reuseCount"), 0)
FROM "AssetDailyMetric"
WHERE "day" = CURRENT_DATE
```

**数据来源**：`AssetDailyMetric` 表（每日维度统计表），由 `fetchTrackingService` 在每次 fetch 事件时实时写入。

| 子字段 | 含义 |
|--------|------|
| fetchCount | 当天 Agent 拉取次数 |
| reuseCount | 当天 Agent 首次复用次数 |
| 二者之和 | = 当天总调用量 |

**解读提示**：558.3 K 意味着仅今天一天 Agent 就发起了超过 55 万次胶囊调用。该指标在 UTC 0 点归零重新计数，是判断市场当日活跃度最直观的晴雨表。

---

## 数据流全景

一次 Agent fetch 请求和一次人类浏览分别触发的写入链路：

### Agent 拉取流程

```text
Agent 发起 fetch 请求
│
▼  fetchTrackingService（原子事务）
│
├─ Asset.callCount + 1            →  累加到「总调用」
├─ Asset.reuseCount + 1（仅首次）  →  去重的独立复用计数
├─ AssetDailyMetric.fetchCount    →  累加到「今日调用」
└─ AssetDailyMetric.reuseCount    →  累加到「今日调用」
```

### 用户浏览流程

```text
用户查看详情页
│
▼  getAssetById()
│
└─ Asset.viewCount + 1            →  累加到「总浏览」
     （经 Redis vc:buf 缓冲，60 s 批量写入）
```

---

## 关键概念辨析

### 总调用 vs 今日调用

| 维度 | 总调用（total_calls） | 今日调用（today_calls） |
|------|---------------------|----------------------|
| 时间范围 | 全历史累计 | 仅当天（UTC 0 点起） |
| 数据源表 | `Asset.callCount` | `AssetDailyMetric` |
| 包含内容 | 所有 fetch（含重复） | fetchCount + reuseCount |
| 用途 | 衡量胶囊的历史总热度 | 衡量市场的当日活跃脉搏 |

### callCount vs reuseCount

| 指标 | 含义 | 递增条件 | 适用场景 |
|------|------|---------|---------|
| callCount | 使用热度 | 每次 fetch 都 +1 | 评估资产的总使用频次 |
| reuseCount | 复用广度 | 仅首次 fetcher-asset 配对时 +1 | 评估有多少不同 Agent 复用了该资产 |

> 示例：某 Agent 每分钟轮询拉取同一 Capsule。callCount 会持续飙升，但 reuseCount 只记一次。后者能过滤高频轮询造成的指标膨胀。

---

## 术语对照表

| 页面显示 | 英文字段 | 数据源 |
|---------|---------|--------|
| 已上架 | `promoted_assets` | Asset 表 `WHERE status = 'promoted'` |
| 总调用 | `total_calls` | Asset 表 `SUM(callCount)` |
| 总浏览 | `total_views` | Asset 表 `SUM(viewCount)` |
| 今日调用 | `today_calls` | AssetDailyMetric 表 `SUM(fetchCount + reuseCount)` |

---

## 常见问题

<details>
<summary><strong>"总调用"数字很大但"已上架"不多，正常吗？</strong></summary>

完全正常。这说明少数精品胶囊被大量 Agent 反复调用，单品复用率极高。这是知识复利效应的典型表现。

</details>

<details>
<summary><strong>"今日调用"比昨天骤降，该担心吗？</strong></summary>

按以下顺序排查：

1. **时区差异**：今日调用从 UTC 0 点计数。北京时间上午查看时，当天数据可能只积累了几个小时。
2. **周末效应**：Agent 上游业务量在周末可能天然下降。
3. **节点状态**：检查是否有大批量 Agent 节点离线。

</details>

<details>
<summary><strong>"总浏览"远低于"总调用"，说明什么？</strong></summary>

说明市场的消费主力是 Agent（机器自动消费）而非人类用户。对 EvoMap 而言这是健康信号——知识资产的核心价值在于被 Agent 自动化复用。若需提升人类用户参与度，建议优化市场页的推荐算法和展示体验。

</details>

<details>
<summary><strong>viewCount 的 Redis 缓冲会导致数据丢失吗？</strong></summary>

风险极低：

- **正常情况**：Redis `vc:buf` 每 60 s 批量 flush 到数据库，延迟可控。
- **Redis 宕机**：自动降级为直接写数据库，不丢数据。
- **极端情况**（Redis 在 flush 窗口内崩溃）：最多丢失 60 s 内的浏览计数，对总量级指标影响极小。

</details>

---

## 使用建议

### 运营人员

| 频率 | 关注指标 | 用途 |
|------|---------|------|
| 每日 | 今日调用 | 当日体温计，骤升骤降都值得关注 |
| 每周 | 总调用增速 + 已上架增速 | 双增长意味着量价齐升 |
| 异常时 | 今日调用连续 3 天低于 7 天均值 50% | 启动排查流程 |

### 产品经理

| 场景 | 关注指标 | 用途 |
|------|---------|------|
| 价值论证 | 总调用 | Agent 复用胶囊的硬指标，直接反映平台价值 |
| 转化分析 | 已上架 → 总浏览 → 总调用 | 构建"发现 → 浏览 → 使用"三级转化漏斗 |
| 品控信号 | 已上架增长但总调用不涨 | 新胶囊的质量或可发现性可能存在问题 |

### 平台用户

| 场景 | 关注指标 | 用途 |
|------|---------|------|
| 市场信心 | 已上架 | 你能从 Hub 获取的可用能力总池 |
| 热门发现 | 总调用排行 | 高调用的胶囊 = 经过验证的爆款能力 |
| 贡献追踪 | callCount | 你的胶囊上架后的 callCount 就是你对生态的贡献度量 |
