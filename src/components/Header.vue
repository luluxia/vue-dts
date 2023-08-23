<script lang="ts" setup>
import { inject, onMounted, reactive, ref, Ref } from 'vue'
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
  await axios.post('login.php?is_new=1', sendData).then(res => {
    state.loading = false
    if (res.data.error) {
      state.error = res.data.error
    } else {
      hideAll()
      const cookies = (window as any).plus.navigator.getCookie('https://dts.loli.camp/').split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith('acbra3_user=')) {
          state.user = decodeURIComponent(cookie.substring('acbra3_user='.length, cookie.length))
          break
        }
      }
    }
  })
}
const logout = async () => {
  const sendData = new FormData()
  sendData.append('mode', 'quit')
  await axios.post('login.php?is_new=1', sendData).then(res => {
    (window as any).plus.navigator.removeAllCookie()
    state.user = ''
    tippy(loginBtnDom.value, {
      content: loginDom.value,
      trigger: 'click',
      interactive: true,
      allowHTML: true,
      arrow: false,
      placement: isMobile?.value ? 'bottom-end' : 'bottom',
    })
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
    placement: isMobile?.value ? 'bottom-end' : 'bottom',
  })
  tippy(settingBtn.value, {
    content: settingContent.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: isMobile?.value ? 'bottom-end' : 'bottom',
  })
  document.addEventListener('plusready', () => {
    const cookies = (window as any).plus.navigator.getCookie('https://dts.loli.camp/').split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith('acbra3_user=')) {
        state.user = decodeURIComponent(cookie.substring('acbra3_user='.length, cookie.length))
        break
      }
    }
  }, false)
})
const saveSetting = (type: string, value: string) => {
  const setting = JSON.parse(localStorage.getItem('setting') || '{}')
  setting[type] = value
  localStorage.setItem('setting', JSON.stringify(setting))
  setTheme(type, value)
}
const setTheme = (type: string, value: string) => {
  if (type === 'font') {
    document.documentElement.style.fontFamily = value
  }
  if (type === 'size') {
    document.documentElement.style.fontSize = `${value}px`
  }
  if (type === 'theme') {
    document.documentElement.setAttribute('data-theme', value)
    const color = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface-container')
    const arr = color.split(',').map(s => parseInt(s.trim()))
    const hex = arr.reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '#');
    (window as any).plus.navigator.setStatusBarBackground(hex);
    (window as any).plus.navigator.setStatusBarStyle(value === 'dark' ? 'light' : 'dark');
  }
  if (type === 'color') {
    document.documentElement.setAttribute('data-color', value)
    const color = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface-container')
    const arr = color.split(',').map(s => parseInt(s.trim()))
    const hex = arr.reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '#');
    (window as any).plus.navigator.setStatusBarBackground(hex);
  }
}
onMounted(() => {
  document.addEventListener('plusready', () => {
    const setting = JSON.parse(localStorage.getItem('setting') || '{}')
    Object.keys(setting).forEach(key => {
      setTheme(key, setting[key])
    })
  }, false)
})
const isMobile = inject('isMobile') as Ref<Boolean>
const showMobileMenu = ref(false)
</script>
<template>
  <div
    class="
      no-view-trans fixed z-3 top-0 h-8 w-screen border-b-2 border-outlineVariant
      bg-surfaceContainer text-onSurface transition
      hover:(opacity-100) <md:(h-12 border-none)
    "
    :class="!state.showHeader && 'opacity-0'"
  >
    <div class="mx-5 h-8 flex items-center justify-between <md:(mx-0 h-12)">
      <div class="flex flex-1">
        <!-- PC端顶栏 -->
        <div v-if="!isMobile">
          <router-link to="/" class="mr-5">
            <!-- <img class="h-6 mr-5" src="https://llx.life/works/dts/img/logo.png" alt=""> -->
            <span class="font-bold text-primary">Battle Royale</span>
          </router-link>
          <router-link to="/game">游戏</router-link>
        </div>
        <!-- 移动端顶栏 -->
        <div v-else class="flex w-screen h-full items-center justify-between">
          <div class="flex-1 text-center">
            <router-link to="/">
              <span class="font-bold text-primary">Battle Royale</span>
            </router-link>
          </div>
          <div @click="showMobileMenu = !showMobileMenu" class="absolute right-2">
            <svg class="stroke-onSurface" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M36 18L24 30L12 18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div
        class="
          flex space-x-2
          <md:(absolute w-full space-x-0 bg-surfaceContainer top-12 px-4 py-2 space-y-4 border-b-2 border-outlineVariant)
        "
        :class="isMobile ? (showMobileMenu ? '!block' : '!hidden') : 'flex'"
      >
        <div v-if="state.user" class="flex">
          <p>欢迎你，{{ state.user }}！</p>
          <p @click="logout()" class="ml-2 cursor-pointer text-onSurfaceVariant">退出</p>
        </div>
        <div v-else class="relative">
          <p ref="loginBtnDom" class="cursor-pointer">登录</p>
          <div ref="loginDom" class="p-4 w-80 bg-surfaceContainerHigh text-onSurface <md:w-[calc(100vw-2rem)]">
            <p class="mb-2 text-base">登录以继续</p>
            <input v-model="state.username" placeholder="用户名" class="p-2 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-sm w-full my-1" type="text" required>
            <input @keypress.enter="login()" v-model="state.password" placeholder="密码" class="p-2 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-sm w-full my-1" type="password" required>
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
        <!-- 移动端菜单页 -->
        <div class="hidden <sm:block">
          <router-link to="/game" class="block">游戏</router-link>
        </div>
        <div>
          <p ref="settingBtn" class="cursor-pointer text-onSurfaceVariant">设置</p>
          <div ref="settingContent" class="p-4 w-max bg-surfaceContainerHigh text-onSurface text-base <md:w-[calc(100vw-2rem)]">
            <div class="space-x-2">
              <span class="font-bold">字体</span>
              <span class="cursor-pointer" @click="saveSetting('font', '')">默认</span>
              <span class="cursor-pointer" @click="saveSetting('font', 'OPPOSans2')">OPPO Sans</span>
            </div>
            <div class="space-x-2">
              <span class="font-bold">尺寸</span>
              <span class="cursor-pointer" @click="saveSetting('size', '14')">很小</span>
              <span class="cursor-pointer" @click="saveSetting('size', '15')">小</span>
              <span class="cursor-pointer" @click="saveSetting('size', '16')">标准</span>
              <span class="cursor-pointer" @click="saveSetting('size', '17')">大</span>
              <span class="cursor-pointer" @click="saveSetting('size', '18')">很大</span>
            </div>
            <div class="space-x-2">
              <span class="font-bold">主题</span>
              <span class="cursor-pointer" @click="saveSetting('theme', 'light')">浅色</span>
              <span class="cursor-pointer" @click="saveSetting('theme', 'dark')">深色</span>
            </div>
            <div class="space-x-2">
              <span class="font-bold">配色</span>
              <span class="cursor-pointer" @click="saveSetting('color', 'red')">朱</span>
              <span class="cursor-pointer" @click="saveSetting('color', 'purple')">紫</span>
              <span class="cursor-pointer" @click="saveSetting('color', 'green')">绿野幻梦</span>
              <span class="cursor-pointer" @click="saveSetting('color', 'blue')">夏日口袋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>