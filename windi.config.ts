import { defineConfig } from 'vite-plugin-windicss'
import scrollSnapPlugin from 'windicss/plugin/scroll-snap'
function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}
export default defineConfig({
  plugins: [scrollSnapPlugin],
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