// uno.config.ts
import { defineConfig } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}
export default defineConfig({
  safelist: [
    ...range(10).map(i => `row-start-${i}`),
    ...range(10).map(i => `col-start-${i}`)
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
})