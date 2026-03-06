---
title: AI 对话助手
audience: 所有用户
version: 1.0
last_updated: 2026-03-05
source_files:
  - src/components/ai-chat/AiChatPanel.jsx
  - src/components/ai-chat/AiChatMessage.jsx
  - src/lib/ai-chat/useAiChat.js
  - src/lib/ai-chat/chatStorage.js
  - src/lib/ai-chat/chatRateLimit.js
  - src/lib/ai-chat/chatContext.js
---

# AI 对话助手

AI 对话助手是嵌入在每个页面中的上下文感知对话面板。它能感知你当前浏览的页面内容，提供即时的智能辅助。

## 与 Ask 的区别

| 维度 | AI 对话助手 | Ask（`/ask`） |
|------|-----------|-------------|
| 入口 | 所有页面的浮动面板 | 独立页面 `/ask` |
| 上下文 | 感知当前页面内容 | 独立的问答会话 |
| 答案去向 | 仅当前会话 | 可能入库成为知识资产 |
| 会话管理 | 本地存储，最多 10 个会话 | 服务端管理 |
| 配额 | 有限次数 | 根据套餐而定 |
| 适用场景 | 快速咨询、页面辅助 | 正式的知识探索 |

---

## 页面结构

### 对话面板（AiChatPanel）

| 区域 | 说明 |
|------|------|
| 消息列表 | 对话历史（AiChatMessage 组件） |
| 输入框 | 文本输入和发送 |
| 配额显示 | 剩余对话次数 |
| 来源引用 | 回答中引用的知识来源 |

### 消息格式

每条消息（`AiChatMessage`）包含：

| 字段 | 说明 |
|------|------|
| role | 角色（user / assistant） |
| content | 消息内容（Markdown 渲染） |
| sources | 引用的知识来源（如有） |

---

## 上下文感知

`chatContext.js` 中的 `collectPageContext()` 自动收集当前页面信息：

| 上下文 | 说明 |
|--------|------|
| pageUrl | 当前页面 URL |
| pageTitle | 页面标题 |
| language | 当前语言 |
| pageDescription | 页面描述 |

这些信息随对话请求一并发送，让 AI 能够"看到"你正在浏览什么。

---

## 配额管理

| 字段 | 说明 |
|------|------|
| remaining | 当前剩余对话次数 |
| limit | 总配额上限 |
| resetsAt | 配额重置时间 |
| unlimited | 是否不限次数（Ultra 用户） |

配额通过两层管理：

1. **本地限流**（`chatRateLimit.js`）：`localStorage` 中的 `evomap_ai_chat_quota`
2. **服务端限流**：`GET /api/hub/ai-chat/quota` 同步真实配额

---

## 数据存储

| 存储位置 | 内容 | 限制 |
|---------|------|------|
| `localStorage:evomap_ai_chat` | 会话和消息 | 最多 10 个会话，每会话 50 条消息 |
| 服务端 | 配额和使用记录 | 根据套餐 |

对话内容不上传到服务端，仅存储在浏览器本地。

---

## API 接口

| API | 用途 | 方式 |
|-----|------|------|
| `POST /api/hub/ai-chat` | 发送对话请求 | SSE（Server-Sent Events）流式返回 |
| `GET /api/hub/ai-chat/quota` | 查询配额 | JSON |

AI 对话使用 SSE 协议流式返回 Token，支持实时打字效果。响应中包含 `tokens`（文本）、`sources`（来源引用）和 `quota`（更新后的配额）。

---

## 常见问题

<details>
<summary><strong>对话记录会同步到其他设备吗？</strong></summary>

不会。对话记录存储在浏览器 `localStorage` 中，仅在当前设备和浏览器有效。清除浏览器数据会丢失所有历史对话。

</details>

<details>
<summary><strong>配额用完了怎么办？</strong></summary>

配额会在固定周期后自动重置（查看 `resetsAt` 时间）。升级到更高套餐可以获得更多配额，Ultra 用户不受限制。

</details>
