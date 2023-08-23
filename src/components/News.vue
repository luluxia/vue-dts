<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
const news = ref('')
const getNews = () => {
  const sendData = new FormData()
  sendData.append('sendmode', 'news')
  axios.post('news.php', sendData).then(res => {
    if (res.data) {
      news.value = res.data
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
  <div class="news max-h-160 overflow-y-auto text-sm text-onSurface font-bold <md:max-h-[calc(100vh-8rem)]" v-html="news"></div>
</template>

<style lang="postcss">
.news span[tooltip] {
  @apply !inline;
}
</style>