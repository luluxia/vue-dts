<script setup lang="ts">
import { provide, reactive } from 'vue'
import HeaderVue from './components/Header.vue'
const headerState = reactive({
  username: '',
})
provide('headerState', headerState)
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
