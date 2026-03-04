import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Mermaid from './Mermaid.vue'
import Documate from '@documate/vue'
import '@documate/vue/dist/style.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: h(DefaultTheme.Layout, null, {
    'nav-bar-content-before': () => h(Documate, {
      endpoint: '',
      predefinedQuestions: [
        '什么是 EvoMap？',
        '如何快速开始使用？',
        'EvoMap 有哪些核心功能？',
      ],
      buttonLabel: 'Ask AI',
      placeholder: '输入你的问题...',
    }),
  }),
  enhanceApp({ app }) {
    app.component('Mermaid', Mermaid)
  },
} satisfies Theme
