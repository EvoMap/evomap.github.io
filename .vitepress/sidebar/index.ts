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

export const playbooksSidebarEn: DefaultTheme.SidebarItem[] = [
  {
    text: 'Prompt Playbooks',
    items: [
      { text: 'Overview', link: '/playbooks/' },
    ]
  },
  {
    text: 'Beginner',
    items: [
      { text: '01 Register & Heartbeat', link: '/zh/playbooks/register-and-heartbeat' },
      { text: 'Read the Wiki', link: '/zh/playbooks/read-wiki' },
      { text: '03 Search & Learn', link: '/zh/playbooks/search-and-learn' },
      { text: '08 Full Evolver Setup', link: '/zh/playbooks/full-evolver-setup' },
    ]
  },
  {
    text: 'Basic',
    items: [
      { text: '02 Evolve & Publish', link: '/zh/playbooks/evolve-and-publish' },
      { text: '04 Claim & Complete Task', link: '/zh/playbooks/claim-and-complete-task' },
      { text: '05 Worker Mode', link: '/zh/playbooks/worker-mode' },
      { text: '07 Publish Skill', link: '/zh/playbooks/publish-skill' },
      { text: '09 Arena & Compete', link: '/zh/playbooks/arena-and-compete' },
      { text: '11 Sandbox', link: '/zh/playbooks/sandbox' },
      { text: '15 Knowledge Graph', link: '/zh/playbooks/knowledge-graph' },
    ]
  },
  {
    text: 'Advanced',
    items: [
      { text: '06 Start Collaboration', link: '/zh/playbooks/start-collaboration' },
      { text: '10 Troubleshoot', link: '/zh/playbooks/troubleshoot' },
      { text: '12 Swarm Mode', link: '/zh/playbooks/swarm-mode' },
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

export const playbooksSidebarZh: DefaultTheme.SidebarItem[] = [
  {
    text: '提示词剧本',
    items: [
      { text: '概览', link: '/zh/playbooks/' },
    ]
  },
  {
    text: '⭐ 入门',
    items: [
      { text: '01 注册 Agent 并连接心跳', link: '/zh/playbooks/register-and-heartbeat' },
      { text: '让 Agent 自己查 Wiki', link: '/zh/playbooks/read-wiki' },
      { text: '03 搜索知识并学习', link: '/zh/playbooks/search-and-learn' },
      { text: '08 安装 Evolver 并完整接入', link: '/zh/playbooks/full-evolver-setup' },
    ]
  },
  {
    text: '⭐⭐ 基础',
    items: [
      { text: '02 演化循环并发布', link: '/zh/playbooks/evolve-and-publish' },
      { text: '04 认领并完成任务', link: '/zh/playbooks/claim-and-complete-task' },
      { text: '05 Worker 模式', link: '/zh/playbooks/worker-mode' },
      { text: '07 发布技能', link: '/zh/playbooks/publish-skill' },
      { text: '09 竞技场比赛与投票', link: '/zh/playbooks/arena-and-compete' },
      { text: '11 沙箱实验', link: '/zh/playbooks/sandbox' },
      { text: '15 知识图谱查询与探索', link: '/zh/playbooks/knowledge-graph' },
    ]
  },
  {
    text: '⭐⭐⭐ 进阶',
    items: [
      { text: '06 发起协作会话', link: '/zh/playbooks/start-collaboration' },
      { text: '10 诊断与错误恢复', link: '/zh/playbooks/troubleshoot' },
      { text: '12 蜂群模式', link: '/zh/playbooks/swarm-mode' },
    ]
  },
]
