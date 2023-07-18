<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import tippy, { hideAll } from 'tippy.js'
const state = reactive({
  user: '',
  showHeader: true,
  loading: false,
  username: '',
  password: '',
  error: '',
})
// 监听滚动条是否不在顶部
window.onscroll = function() {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    state.showHeader = false
  } else {
    state.showHeader = true
  }
}
const login = async () => {
  state.loading = true
  const sendData = new FormData()
  sendData.append('mode', 'main')
  sendData.append('username', state.username)
  sendData.append('password', state.password)
  await axios.post('/old/login.php?is_new=1', sendData).then(res => {
    state.loading = false
    if (res.data.error) {
      state.error = res.data.error
    } else {
      window.location.reload()
    }
  })
}
const logout = async () => {
  const sendData = new FormData()
  sendData.append('mode', 'quit')
  await axios.post('/old/login.php?is_new=1', sendData).then(res => {
    window.location.reload()
  })
}
const loginBtnDom = ref()
const loginDom = ref()
onMounted(() => {
  console.log(loginDom.value)
  tippy(loginBtnDom.value, {
    content: loginDom.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom-end',
    offset: [0, 25],
  })
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith('acbra3_user=')) {
      state.user = cookie.substring('acbra3_user='.length, cookie.length)
      break
    }
  }
})
</script>
<template>
  <header
    class="no-view-trans fixed z-1 top-0 h-15 w-screen border-b-2 border-zinc-600/20 bg-zinc-700/20 transition hover:(opacity-100 bg-zinc-800/90)"
    :class="!state.showHeader && 'opacity-0'"
  >
    <div class="max-w-screen-xl h-15 mx-auto flex items-center justify-between <sm:w-full <sm:px-4">
      <div class="flex">
        <router-link to="/">
          <img class="h-6 mr-5" src="/img/logo.png" alt="">
        </router-link>
        <div class="text-zinc-300">
          <router-link to="/game">游戏</router-link>
        </div>
      </div>
      <div class="text-zinc-300">
        <div v-if="state.user" class="flex">
          <p>欢迎你，{{ state.user }}！</p>
          <p @click="logout()" class="text-zinc-400 ml-2 cursor-pointer">退出</p>
        </div>
        <div v-else class="relative">
          <p ref="loginBtnDom" class="cursor-pointer">登录</p>
          <div ref="loginDom" class="p-4 w-80 bg-zinc-800 rounded shadow">
            <p class="mb-2">登录以继续</p>
            <input v-model="state.username" placeholder="用户名" class="p-2 bg-zinc-700 text-zinc-300 rounded text-sm w-full my-1" type="text" required>
            <input v-model="state.password" placeholder="密码" class="p-2 bg-zinc-700 text-zinc-300 rounded text-sm w-full my-1" type="password" required>
            <p v-if="state.error" class="text-sm text-rose-500 mt-1">{{ state.error }}</p>
            <div class="flex items-center justify-between mt-2">
              <router-link to="/register" @click="hideAll" class="text-sm text-zinc-400">还没有账号？前往注册！</router-link>
              <p
                @click="login()"
                class="px-4 py-2 w-max bg-sky-800 text-zinc-300 rounded text-sm cursor-pointer transition hover:bg-sky-700"
                :class="state.loading && 'opacity-50 pointer-events-none'"
              >登录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>