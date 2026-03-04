/**
 * @packageDocumentation
 * Markdown-it plugin for Mermaid diagram support.
 *
 * @module docs-site/theme/mermaidPlugin
 */
import type MarkdownIt from 'markdown-it'

/**
 * Markdown-it plugin that transforms mermaid code blocks into Mermaid Vue components.
 *
 * @param md - The markdown-it instance
 * @example
 * ```ts
 * import { defineConfig } from 'vitepress'
 * import { mermaidPlugin } from './theme/mermaidPlugin'
 *
 * export default defineConfig({
 *   markdown: {
 *     config: (md) => {
 *       md.use(mermaidPlugin)
 *     }
 *   }
 * })
 * ```
 */
export function mermaidPlugin(md: MarkdownIt): void {
  const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()

    if (info === 'mermaid') {
      const code = token.content.trim()
      // Escape the code for safe embedding in Vue component
      const escapedCode = encodeURIComponent(code)
      return `<Mermaid :code="decodeURIComponent('${escapedCode}')" />\n`
    }

    return defaultFence(tokens, idx, options, env, self)
  }
}
