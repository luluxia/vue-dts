<script setup lang="ts">
import { provide, ref } from 'vue'
import Log from './Log.vue'
import News from './News.vue'
const showSidebar = ref(false)
const sidebarType = ref('')
const haveNewMessage = ref(true)
const haveNewNews = ref(true)
provide('haveNewMessage', haveNewMessage)
provide('haveNewNews', haveNewNews)
</script>
<template>
<div>
  <div @mouseenter="showSidebar = false" v-if="showSidebar" class="fixed w-full h-full top-0 z-1"></div>
  <div
    class="w-150 fixed left-0 top-0 bottom-0 border-r-2 border-zinc-700/20 bg-zinc-900/95 z-1 transition transform -translate-x-150"
    :class="showSidebar && '!translate-x-15'"
  >
    <Log :class="sidebarType == 'log' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"/>
    <News :class="sidebarType == 'news' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"/>
  </div>
  <div class="w-15 fixed left-0 top-0 bottom-0 bg-zinc-800 z-1 flex flex-col items-center justify-end py-5">
    <div @mouseover.stop="showSidebar = true; haveNewNews = false; sidebarType = 'news'" class="w-15 h-15 flex group transition hover:bg-zinc-700/50">
      <img :class="haveNewNews ? 'opacity-30' : '!opacity-0'" class="p-3 transition absolute group-hover:opacity-100" src="https://llx.life/works/dts/img/log_notice.svg" alt="">
      <img :class="haveNewNews ? '!opacity-0' : 'opacity-30'" class="p-3 transition absolute group-hover:opacity-100" src="https://llx.life/works/dts/img/log.svg" alt="">
    </div>
    <div @mouseover.stop="showSidebar = true; haveNewMessage = false; sidebarType = 'log'" class="w-15 h-15 flex group transition hover:bg-zinc-700/50">
      <img :class="haveNewMessage ? 'opacity-30' : '!opacity-0'" class="p-3 transition absolute group-hover:opacity-100" src="https://llx.life/works/dts/img/chat_notice.svg" alt="">
      <img :class="haveNewMessage ? '!opacity-0' : 'opacity-30'" class="p-3 transition absolute group-hover:opacity-100" src="https://llx.life/works/dts/img/chat.svg" alt="">
    </div>
  </div>
</div>
</template>