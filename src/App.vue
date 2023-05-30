<script setup lang="ts">
import HeaderVue from './components/Header.vue'
import './assets/pattern.min.css'
</script>

<template>
  <HeaderVue/>
  <router-view class="mt-16"></router-view>
</template>

<style lang="postcss">
input {
  @apply outline-none transition;
}
input:focus-visible {
  @apply ring-2 ring-zinc-500;
}
[data-theme="tooltip"] {
  @apply p-2 rounded-none shadow;
}
[data-theme="tooltip"] .tippy-content {
  @apply text-sm text-left w-max max-w-70 text-zinc-200 whitespace-pre-line;
}
</style>
