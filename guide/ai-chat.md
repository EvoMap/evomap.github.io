---
title: AI Chat Assistant
audience: All users
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

# AI Chat Assistant

The AI Chat Assistant is a context-aware conversation panel embedded on every page. It can perceive the content of the page you're currently browsing and provide instant intelligent assistance.

## Difference from Ask

| Dimension | AI Chat Assistant | Ask (`/ask`) |
|-----------|------------------|-------------|
| Entry Point | Floating panel on all pages | Dedicated page `/ask` |
| Context | Aware of current page content | Independent Q&A session |
| Answer Destination | Current session only | May be archived as knowledge assets |
| Session Management | Local storage, max 10 sessions | Server-managed |
| Quota | Limited usage | Based on plan |
| Use Case | Quick queries, page assistance | Formal knowledge exploration |

---

## Page Structure

### Chat Panel (AiChatPanel)

| Section | Description |
|---------|-------------|
| Message List | Conversation history (AiChatMessage component) |
| Input Box | Text input and send |
| Quota Display | Remaining conversation count |
| Source Citations | Knowledge sources cited in responses |

### Message Format

Each message (`AiChatMessage`) contains:

| Field | Description |
|-------|-------------|
| role | Role (user / assistant) |
| content | Message content (Markdown rendered) |
| sources | Cited knowledge sources (if any) |

---

## Context Awareness

`collectPageContext()` in `chatContext.js` automatically collects current page information:

| Context | Description |
|---------|-------------|
| pageUrl | Current page URL |
| pageTitle | Page title |
| language | Current language |
| pageDescription | Page description |

This information is sent along with conversation requests, letting the AI "see" what you're browsing.

---

## Quota Management

| Field | Description |
|-------|-------------|
| remaining | Current remaining conversation count |
| limit | Total quota limit |
| resetsAt | Quota reset time |
| unlimited | Whether unlimited (Ultra users) |

Quota is managed through two layers:

1. **Local rate limiting** (`chatRateLimit.js`): `evomap_ai_chat_quota` in `localStorage`
2. **Server-side rate limiting**: `GET /api/hub/ai-chat/quota` syncs real quota

---

## Data Storage

| Storage | Content | Limit |
|---------|---------|-------|
| `localStorage:evomap_ai_chat` | Sessions and messages | Max 10 sessions, 50 messages per session |
| Server | Quota and usage records | Based on plan |

Conversation content is not uploaded to the server — stored in browser local storage only.

---

## API Reference

| API | Purpose | Method |
|-----|---------|--------|
| `POST /api/hub/ai-chat` | Send conversation request | SSE (Server-Sent Events) streaming |
| `GET /api/hub/ai-chat/quota` | Query quota | JSON |

AI Chat uses SSE protocol for streaming token responses, supporting real-time typing effects. Responses include `tokens` (text), `sources` (source citations), and `quota` (updated quota).

---

## FAQ

<details>
<summary><strong>Will conversation history sync to other devices?</strong></summary>

No. Conversation history is stored in browser `localStorage`, only valid on the current device and browser. Clearing browser data will delete all conversation history.

</details>

<details>
<summary><strong>What if my quota runs out?</strong></summary>

Quota automatically resets after a fixed cycle (check `resetsAt` time). Upgrading to a higher plan gives more quota; Ultra users have no limits.

</details>
