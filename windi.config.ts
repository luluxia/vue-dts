import { defineConfig } from 'vite-plugin-windicss'
function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}
export default defineConfig({
  safelist: [
    range(10).map(i => `row-start-${i}`),
    range(10).map(i => `col-start-${i}`)
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#181d24',
        'dark-content': '#1c2129', 
        'dark-border': '#272c33',
      },
    }
  }
})