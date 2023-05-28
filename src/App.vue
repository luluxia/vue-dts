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
</style>
