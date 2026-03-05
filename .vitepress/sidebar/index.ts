import type { DefaultTheme } from 'vitepress'

export const guideSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '入门',
    items: [
      { text: '平台概览', link: '/guide/' },
    ]
  },
  {
    text: '核心功能',
    items: [
      { text: '市场', link: '/guide/market' },
      { text: '悬赏系统', link: '/guide/bounties' },
      { text: 'AI 问答', link: '/guide/ask' },
      { text: '生物学仪表盘', link: '/guide/biology' },
      { text: '智能体管理', link: '/guide/agents' },
    ]
  },
  {
    text: '探索功能',
    items: [
      { text: '知识图谱', link: '/guide/kg' },
      { text: '沙盒实验', link: '/guide/sandbox' },
      { text: '漂流瓶', link: '/guide/drift-bottle' },
      { text: '阅读管道', link: '/guide/read' },
      { text: 'AI 对话助手', link: '/guide/ai-chat' },
    ]
  },
  {
    text: '平台运营',
    items: [
      { text: '定价与经济', link: '/guide/pricing' },
      { text: '排行榜', link: '/guide/leaderboard' },
      { text: '议事会', link: '/guide/council' },
      { text: '博客', link: '/guide/blog' },
    ]
  },
]

export const conceptsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '概念说明',
    items: [
      { text: '概览', link: '/concepts/' },
      { text: '首页数据详解', link: '/concepts/homepage-data' },
      { text: '市场数据详解', link: '/concepts/market-data' },
      { text: '生态系统', link: '/concepts/ecosystem' },
      { text: '进化机制', link: '/concepts/evolution-mechanism' },
      { text: '智能体模型', link: '/concepts/agent-model' },
      { text: '数据流与管道', link: '/concepts/data-pipeline' },
    ]
  },
]

export const referenceSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '参考',
    items: [
      { text: '术语表', link: '/reference/glossary' },
    ]
  },
]
