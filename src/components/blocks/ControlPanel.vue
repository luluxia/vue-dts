<!-- 使用破灭之诗后解锁的控制面板 -->
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import tippy, { hideAll } from 'tippy.js'
import Card from '../Card.vue'
import { command } from '../../utils/api'
import { weatherData } from '../../utils/data'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
  actionState.action = [
  { name: '返回', action: () => { gameState.drawerType = '' } },
]
const weatherBtn = ref()
const weatherListDom = ref()
const weatherList = Object.keys(weatherData).filter(i => i !== '18')
onMounted(() => {
  tippy(weatherBtn.value, {
    content: weatherListDom.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom',
    appendTo: () => document.body,
  })
})
// 天气控制
const changeWeather = async (i: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'consle_wthchange', cwth: i }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
  hideAll()
}
// 生命探测
const checkLife = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'consle_radar' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    if (data.playerState.radar) {
      gameState.drawerType = 'radar'
    }
  })
}
// 增设禁区
const addForbiddenArea = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'consle_areactrl1' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 解除禁区
const removeForbiddenArea = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'consle_areactrl0' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 按钮
const pushButton = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'consle_dbutton' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">控制面板</h1>
  <p class="text-zinc-400 mb-2">
    可用信道 
    <span class="green">{{ gameState.playerState?.controlPanel.channel }} / {{ gameState.playerState?.controlPanel.channelAll }}</span>
  </p>
  <div class="flex">
    <Card :length="2" title="天气控制">
      <div class="m-auto w-full text-center font-bold">
        <p ref="weatherBtn" class="w-full transition cursor-pointer hover:(bg-zinc-200 text-zinc-800)">
          {{ weatherData[gameState.playerState?.area.weather || 0] }}
        </p>
        <div ref="weatherListDom" class="max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain border-zinc-500 text-zinc-200 text-center p-0.5">
          <p @click="changeWeather(i)" v-for="i in weatherList" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)">
            {{ weatherData[i] }}
          </p>
        </div>
      </div>
    </Card>
    <Card :length="2" title="数据控制">
      <div class="m-auto w-full text-center font-bold space-y-1">
        <p @click="gameState.drawerType = 'search'" class="w-full transition cursor-pointer hover:(bg-zinc-200 text-zinc-800)">数据检索</p>
        <p @click="checkLife()" class="w-full transition cursor-pointer hover:(bg-zinc-200 text-zinc-800)">生命探测</p>
      </div>
    </Card>
    <Card :length="2" title="禁区控制">
      <div class="m-auto w-full text-center font-bold space-y-1">
        <p @click="addForbiddenArea()" class="w-full transition cursor-pointer hover:(bg-zinc-200 text-zinc-800)">增设禁区</p>
        <p @click="removeForbiddenArea()" class="w-full transition cursor-pointer hover:(bg-zinc-200 text-zinc-800)">解除禁区</p>
      </div>
    </Card>
    <Card v-if="!gameState.playerState?.controlPanel.noButton" @click="pushButton()" :length="3">
      <div class="w-full h-full bg-rose-600/80 p-0.5 pattern-diagonal-lines-sm text-zinc-300/5 cursor-pointer">
        <div class="w-full h-full border-2 border-zinc-800 flex">
          <div class="m-auto font-bold text-zinc-300 text-xl tracking-widest">
            <p>DON'T PUSH</p>
            <p>危险勿触</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>