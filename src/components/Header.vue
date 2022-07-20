<script lang="ts" setup>
import { reactive } from 'vue'
const state = reactive({
  showHeader: true
})
// 监听滚动条是否不在顶部
window.onscroll = function() {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    state.showHeader = false
  } else {
    state.showHeader = true
  }
}
</script>
<template>
  <header
    class="fixed z-1 top-0 h-15 w-screen mb-2 border-b-2 border-zinc-600/20 bg-zinc-700/20 transition hover:(opacity-100 bg-zinc-800/90)"
    :class="!state.showHeader && 'opacity-0'"
  >
    <div class="max-w-screen-xl h-15 mx-auto flex items-center">
      <img class="h-6" src="/img/logo.svg" alt="">
    </div>
  </header>
</template>