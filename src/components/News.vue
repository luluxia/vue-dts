<script setup lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue'
import axios from 'axios'
const news = ref('')
const latestNewsLength = ref(0)
const haveNewNews = inject('haveNewNews') as any

const getNews = () => {
  const sendData = new FormData()
  sendData.append('sendmode', 'news')
  axios.post('/old/news.php', sendData).then(res => {
    if (res.data) {
      news.value = res.data
      if (latestNewsLength.value !== res.data.length) {
        haveNewNews.value = true
        latestNewsLength.value = res.data.length
      }
    }
  })
}
let timer: any
onMounted(() => {
  getNews()
  timer = setInterval(() => {
    getNews()
  }, 15000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div class="text-zinc-300 absolute w-full h-full flex flex-col">
    <h1 class="m-4 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-700 border-b-2 border-dashed mb-1">
      进行状况<span class="text-base -ml-1 opacity-30">NEWS</span>
    </h1>
    <div class="flex-1 overflow-y-auto mr-4 mb-1">
      <div class="news text-sm tooltip-down message flex items-end px-3.5" v-html="news"></div>
    </div>
  </div>
</template>
<style lang="postcss">
.news span[tooltip] {
  @apply !inline;
}
</style>