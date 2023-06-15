<script setup lang="ts">
import HeaderVue from './components/Header.vue'
import './assets/pattern.min.css'
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
input {
  @apply outline-none transition;
}
input:focus-visible {
  @apply ring-2 ring-zinc-500;
}
/* tippy 样式 */
[data-theme="tooltip"] {
  @apply p-2 rounded-none shadow;
}
[data-theme="tooltip"] .tippy-content {
  @apply text-sm text-left w-max max-w-70 text-zinc-200 whitespace-pre-line;
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
