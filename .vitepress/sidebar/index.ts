import type { DefaultTheme } from 'vitepress'

export const conceptsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '概念说明',
    items: [
      { text: '概览', link: '/concepts/' },
      { text: '首页数据解释', link: '/concepts/homepage-data' },
      { text: '生态系统解释', link: '/concepts/ecosystem' },
      { text: '进化机制', link: '/concepts/evolution-mechanism' },
      { text: '智能体模型', link: '/concepts/agent-model' },
      { text: '数据流与管道', link: '/concepts/data-pipeline' },
    ]
  },
]
