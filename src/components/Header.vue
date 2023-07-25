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
const settingBtn = ref()
const settingContent = ref()
onMounted(() => {
  tippy(loginBtnDom.value, {
    content: loginDom.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom-end',
    offset: [0, 25],
  })
  tippy(settingBtn.value, {
    content: settingContent.value,
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
const setTheme = (type: string) => {
  if (type === 'normalSize') {
    document.documentElement.style.fontSize = '16px'
  }
  if (type === 'bigSize') {
    document.documentElement.style.fontSize = '17px'
  }
  if (type === 'light') {
    const cssFile = document.querySelector('link[id="css-theme')
    cssFile?.setAttribute('href', '/css/light.css')
  }
  if (type === 'dark') {
    const cssFile = document.querySelector('link[id="css-theme')
    cssFile?.setAttribute('href', '/css/dark.css')
  }
  if (type === 'red') {
    const cssFile = document.querySelector('link[id="css-color')
    cssFile?.setAttribute('href', '/css/red.css')
  }
  if (type === 'purple') {
    const cssFile = document.querySelector('link[id="css-color')
    cssFile?.setAttribute('href', '/css/purple.css')
  }
}
</script>
<template>
  <div
    class="
      no-view-trans fixed z-1 top-0 h-15 w-screen border-b-2 border-outlineVariant
      bg-surfaceContainer text-onSurface transition
      hover:(opacity-100 bg-surfaceDim)
    "
    :class="!state.showHeader && 'opacity-0'"
  >
    <div class="mx-5 h-15 flex items-center justify-between">
      <div class="flex">
        <router-link to="/">
          <!-- <img class="h-6 mr-5" src="/img/logo.png" alt=""> -->
          <span class="font-bold mr-5 text-primary">Battle Royale</span>
        </router-link>
        <div>
          <router-link to="/game">游戏</router-link>
        </div>
      </div>
      <div class="flex space-x-2">
        <div v-if="state.user" class="flex">
          <p>欢迎你，{{ state.user }}！</p>
          <p @click="logout()" class="ml-2 cursor-pointer text-onSurfaceVariant">退出</p>
        </div>
        <div v-else class="relative">
          <p ref="loginBtnDom" class="cursor-pointer">登录</p>
          <div ref="loginDom" class="p-4 w-80 bg-surfaceContainerHigh text-onSurface">
            <p class="mb-2 text-base">登录以继续</p>
            <input v-model="state.username" placeholder="用户名" class="p-2 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-sm w-full my-1" type="text" required>
            <input v-model="state.password" placeholder="密码" class="p-2 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-sm w-full my-1" type="password" required>
            <p v-if="state.error" class="text-sm mt-1 text-error">{{ state.error }}</p>
            <div class="flex items-center justify-between mt-2">
              <router-link to="/register" @click="hideAll" class="text-sm text-onSurfaceVariant opacity-80">还没有账号？前往注册！</router-link>
              <p
                @click="login()"
                class="px-4 py-2 w-max bg-primary text-onPrimary rounded text-sm cursor-pointer transition hover:brightness-110"
                :class="state.loading && 'opacity-50 pointer-events-none'"
              >登录</p>
            </div>
          </div>
        </div>
        <div>
          <p ref="settingBtn" class="cursor-pointer text-onSurfaceVariant">设置</p>
          <div ref="settingContent" class="p-4 w-max bg-surfaceContainerHigh text-onSurface text-base">
            <div class="space-x-2">
              <span class="font-bold">字体</span>
              <span @click="setTheme('normalSize')">标准</span>
              <span @click="setTheme('bigSize')">大</span>
            </div>
            <div class="space-x-2">
              <span class="font-bold">主题</span>
              <span @click="setTheme('light')">浅色</span>
              <span @click="setTheme('dark')">深色</span>
            </div>
            <div class="space-x-2">
              <span class="font-bold">配色</span>
              <span @click="setTheme('red')">朱</span>
              <span @click="setTheme('purple')">紫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>