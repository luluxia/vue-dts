// uno.config.ts
import { defineConfig } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}
function cardWidth(size: number) {
  return [`w-${1 * size + 1 - 0.5}`, `w-${2 * size + 2 - 0.5}`, `w-${3 * size + 3 - 0.5}`, `w-${4 * size + 4 - 0.5}`]
}
export default defineConfig({
  safelist: [
    ...range(10).map(i => `row-start-${i}`),
    ...range(10).map(i => `col-start-${i}`),
    ...cardWidth(15),
    ...cardWidth(18.5),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  theme: {
    colors: {
      surface: 'rgba(var(--md-sys-color-surface), <alpha-value>)',
      surfaceDim: 'rgba(var(--md-sys-color-surface-dim), <alpha-value>)',
      surfaceContainer: 'rgba(var(--md-sys-color-surface-container), <alpha-value>)',
      surfaceContainerHigh: 'rgba(var(--md-sys-color-surface-container-high), <alpha-value>)',
      surfaceContainerHighest: 'rgba(var(--md-sys-color-surface-container-highest), <alpha-value>)',
      onSurface: 'rgba(var(--md-sys-color-on-surface), <alpha-value>)',
      onSurfaceVariant: 'rgba(var(--md-sys-color-on-surface-variant), <alpha-value>)',
      outline: 'rgba(var(--md-sys-color-outline), <alpha-value>)',
      outlineVariant: 'rgba(var(--md-sys-color-outline-variant), <alpha-value>)',
      primary: `rgba(var(--md-sys-color-primary), <alpha-value>)`,
      onPrimary: `rgba(var(--md-sys-color-on-primary), <alpha-value>)`,
      primaryContainer: 'rgba(var(--md-sys-color-primary-container), <alpha-value>)',
      onPrimaryContainer: 'rgba(var(--md-sys-color-on-primary-container), <alpha-value>)',
      onPrimaryFixed: 'rgba(var(--md-sys-color-on-primary-fixed), <alpha-value>)',
      onPrimaryFixedVariant: 'rgba(var(--md-sys-color-on-primary-fixed-variant), <alpha-value>)',
      secondary: 'rgba(var(--md-sys-color-secondary), <alpha-value>)',
      onSecondary: 'rgba(var(--md-sys-color-on-secondary), <alpha-value>)',
      secondaryContainer: 'rgba(var(--md-sys-color-secondary-container), <alpha-value>)',
      onSecondaryContainer: 'rgba(var(--md-sys-color-on-secondary-container), <alpha-value>)',
      tertiary: 'rgba(var(--md-sys-color-tertiary), <alpha-value>)',
      onTertiary: 'rgba(var(--md-sys-color-on-tertiary), <alpha-value>)',
      tertiaryContainer: 'rgba(var(--md-sys-color-tertiary-container), <alpha-value>)',
      onTertiaryContainer: 'rgba(var(--md-sys-color-on-tertiary-container), <alpha-value>)',
      error: 'rgba(var(--md-sys-color-error), <alpha-value>)',
    }
  }
})