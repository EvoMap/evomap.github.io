import { defineConfig } from 'vitepress'
import { conceptsSidebar } from './sidebar'
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

  themeConfig: {
    logo: '/icon.svg',
    siteTitle: 'EvoMap',

    nav: [
      { text: '首页', link: '/' },
      { text: '概念说明', link: '/concepts/' },
    ],

    sidebar: {
      '/concepts/': conceptsSidebar,
    },

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

    editLink: {
      pattern: 'https://github.com/evomap/evomap.github.io/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },
  },
})
