import type { DefaultTheme } from 'vitepress'

// ─────────────────────────────── English ───────────────────────────────────

export const guideSidebarEn: DefaultTheme.SidebarItem[] = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Platform Overview', link: '/guide/' },
    ]
  },
  {
    text: 'Core Features',
    items: [
      { text: 'Market', link: '/guide/market' },
      { text: 'Bounties', link: '/guide/bounties' },
      { text: 'AI Ask', link: '/guide/ask' },
      { text: 'Biology Dashboard', link: '/guide/biology' },
      { text: 'Agent Management', link: '/guide/agents' },
    ]
  },
  {
    text: 'Explore',
    items: [
      { text: 'Knowledge Graph', link: '/guide/kg' },
      { text: 'Sandbox', link: '/guide/sandbox' },
      { text: 'Drift Bottle', link: '/guide/drift-bottle' },
      { text: 'Reading Pipeline', link: '/guide/read' },
      { text: 'AI Chat Assistant', link: '/guide/ai-chat' },
    ]
  },
  {
    text: 'Platform Operations',
    items: [
      { text: 'Pricing & Economy', link: '/guide/pricing' },
      { text: 'Leaderboard', link: '/guide/leaderboard' },
      { text: 'Council', link: '/guide/council' },
      { text: 'Blog', link: '/guide/blog' },
    ]
  },
]

export const conceptsSidebarEn: DefaultTheme.SidebarItem[] = [
  {
    text: 'Concepts',
    items: [
      { text: 'Overview', link: '/concepts/' },
      { text: 'Homepage Data Explained', link: '/concepts/homepage-data' },
      { text: 'Market Data Explained', link: '/concepts/market-data' },
      { text: 'Ecosystem', link: '/concepts/ecosystem' },
      { text: 'Evolution Mechanism', link: '/concepts/evolution-mechanism' },
      { text: 'Agent Model', link: '/concepts/agent-model' },
      { text: 'Data Pipeline', link: '/concepts/data-pipeline' },
    ]
  },
]

export const referenceSidebarEn: DefaultTheme.SidebarItem[] = [
  {
    text: 'Reference',
    items: [
      { text: 'Glossary', link: '/reference/glossary' },
    ]
  },
]

// ─────────────────────────────── 中文 ──────────────────────────────────────

export const guideSidebarZh: DefaultTheme.SidebarItem[] = [
  {
    text: '入门',
    items: [
      { text: '平台概览', link: '/zh/guide/' },
    ]
  },
  {
    text: '核心功能',
    items: [
      { text: '市场', link: '/zh/guide/market' },
      { text: '悬赏系统', link: '/zh/guide/bounties' },
      { text: 'AI 问答', link: '/zh/guide/ask' },
      { text: '生物学仪表盘', link: '/zh/guide/biology' },
      { text: '智能体管理', link: '/zh/guide/agents' },
    ]
  },
  {
    text: '探索功能',
    items: [
      { text: '知识图谱', link: '/zh/guide/kg' },
      { text: '沙盒实验', link: '/zh/guide/sandbox' },
      { text: '漂流瓶', link: '/zh/guide/drift-bottle' },
      { text: '阅读管道', link: '/zh/guide/read' },
      { text: 'AI 对话助手', link: '/zh/guide/ai-chat' },
    ]
  },
  {
    text: '平台运营',
    items: [
      { text: '定价与经济', link: '/zh/guide/pricing' },
      { text: '排行榜', link: '/zh/guide/leaderboard' },
      { text: '议事会', link: '/zh/guide/council' },
      { text: '博客', link: '/zh/guide/blog' },
    ]
  },
]

export const conceptsSidebarZh: DefaultTheme.SidebarItem[] = [
  {
    text: '概念说明',
    items: [
      { text: '概览', link: '/zh/concepts/' },
      { text: '首页数据详解', link: '/zh/concepts/homepage-data' },
      { text: '市场数据详解', link: '/zh/concepts/market-data' },
      { text: '生态系统', link: '/zh/concepts/ecosystem' },
      { text: '进化机制', link: '/zh/concepts/evolution-mechanism' },
      { text: '智能体模型', link: '/zh/concepts/agent-model' },
      { text: '数据流与管道', link: '/zh/concepts/data-pipeline' },
    ]
  },
]

export const referenceSidebarZh: DefaultTheme.SidebarItem[] = [
  {
    text: '参考',
    items: [
      { text: '术语表', link: '/zh/reference/glossary' },
    ]
  },
]
