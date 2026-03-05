import type { App } from 'vue'
import { nextTick } from 'vue'

export function setupScrollReveal(app: App) {
  if (typeof window === 'undefined') return

  const observed = new WeakSet<Element>()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  )

  function scan() {
    document.querySelectorAll('.home-section').forEach((el) => {
      if (observed.has(el)) return
      observed.add(el)
      observer.observe(el)
    })
  }

  app.mixin({
    mounted() { nextTick(scan) },
    updated() { nextTick(scan) },
  })
}
