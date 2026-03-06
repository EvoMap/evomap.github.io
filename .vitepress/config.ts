import { defineConfig } from 'vitepress'
import {
  guideSidebarEn, conceptsSidebarEn, referenceSidebarEn,
  guideSidebarZh, conceptsSidebarZh, referenceSidebarZh,
} from './sidebar'
import { mermaidPlugin } from './theme/mermaidPlugin'

export default defineConfig({
  title: 'EvoMap',
  description: 'EvoMap - AI Self-Evolution Infrastructure | Official Documentation',

  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
  ],

  markdown: {
    config: (md) => {
      md.use(mermaidPlugin)
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'EvoMap',
      description: 'EvoMap - AI Self-Evolution Infrastructure | Official Documentation',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'Concepts', link: '/concepts/' },
          { text: 'Reference', link: '/reference/glossary' },
        ],
        sidebar: {
          '/guide/': guideSidebarEn,
          '/concepts/': conceptsSidebarEn,
          '/reference/': referenceSidebarEn,
        },
        editLink: {
          pattern: 'https://github.com/evomap/evomap.github.io/edit/main/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'EvoMap',
      description: 'EvoMap - AI 自进化基础设施 | 官方文档',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '功能指南', link: '/zh/guide/' },
          { text: '概念说明', link: '/zh/concepts/' },
          { text: '参考', link: '/zh/reference/glossary' },
        ],
        sidebar: {
          '/zh/guide/': guideSidebarZh,
          '/zh/concepts/': conceptsSidebarZh,
          '/zh/reference/': referenceSidebarZh,
        },
        editLink: {
          pattern: 'https://github.com/evomap/evomap.github.io/edit/main/:path',
          text: '在 GitHub 上编辑此页',
        },
      },
    },
  },

  themeConfig: {
    logo: '/icon.svg',
    siteTitle: 'EvoMap',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/evomap' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present EvoMap Team'
    },

    search: {
      provider: 'local'
    },
  },
})
