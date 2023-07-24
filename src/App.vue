<script setup lang="ts">
import HeaderVue from './components/Header.vue'
import './assets/pattern.min.css'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
</script>

<template>
  <HeaderVue/>
  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style lang="postcss">
@font-face {
  font-family: OPPOSans2;
  font-weight: 400;
  font-display: swap;
  src: url(https://dsfs.oppo.com/oppo/shop-pc-v2/main/fonts/OPPOSans-Regular.39ccf2a.ttf) format("truetype")
}
@font-face {
  font-family: OPPOSans2;
  font-weight: 700;
  font-display: swap;
  src: url(https://dsfs.oppo.com/oppo/shop-pc-v2/main/fonts/OPPOSans-Medium.621326d.ttf) format("truetype")
}
body {
  font-family: OPPOSans2;
}
input {
  @apply outline-none transition;
}
input:focus-visible {
  @apply ring-2 ring-outline;
}
input::placeholder {
  @apply !text-onSurface !opacity-60;
}
/* tippy 样式 */
.tippy-box {
  @apply border-2 border-outline !bg-surfaceContainerHigh !text-onSurface !max-w-max w-max overflow-hidden;
}
.tippy-content {
  @apply !p-0;
}
[data-theme="tooltip"] {
  @apply p-2 rounded-none shadow;
}
[data-theme="tooltip"] .tippy-content {
  @apply text-sm text-left w-max max-w-70 text-onSurface whitespace-pre-line;
}
/* 过渡样式 */
.v-enter-active, .v-leave-active {
  transition: opacity 0.2s;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
