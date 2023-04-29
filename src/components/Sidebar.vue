<script setup lang="ts">
import { ref } from 'vue'
import Log from './Log.vue'
const showSidebar = ref(false)
</script>
<template>
  <div
    class="w-150 fixed left-0 top-0 bottom-0 border-r-2 border-zinc-700/20 bg-zinc-900/95 z-1 transition transform -translate-x-150"
    :class="showSidebar && '!translate-x-15'"
    @mouseleave="showSidebar = false"
  >
    <Log/>
  </div>
  <div @mouseover="showSidebar = false" class="w-15 fixed left-0 top-0 bottom-0 bg-zinc-800 z-1 flex flex-col items-center justify-end py-5">
    <div @mouseover.stop="showSidebar = true" class="w-15 h-15 flex group transition hover:bg-zinc-700/50">
      <img class="p-3 transition opacity-30 group-hover:opacity-100" src="/img/history.svg" alt="">
    </div>
    <div @mouseover.stop="showSidebar = true" class="w-15 h-15 flex group transition hover:bg-zinc-700/50">
      <img class="p-3 transition opacity-30 group-hover:opacity-100" src="/img/chat.svg" alt="">
    </div>
  </div>
</template>