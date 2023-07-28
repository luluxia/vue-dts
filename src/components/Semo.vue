<script lang="ts" setup>
import { computed, inject } from 'vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      semo: gameState.playerState.semo,
      debuff: gameState.playerState.debuff.match(/[bhaf]/g),
    }
  }
})
const infInfo = {
  b: '胸部受伤',
  h: '头部受伤',
  a: '腕部受伤',
  f: '足部受伤',
} as any
const memory = async (key: any) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'memory' + key }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
  })
}
const heal = async (i: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'special', command: 'inf' + i }).then(res => {
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
  <div class="flex space-x-1 pb-1 justify-center">
    <div
      @click="memory(key)"
      class="p-1 transition cursor-pointer bg-surfaceContainer ring-outlineVariant rounded hover:(ring-2)"
      v-for="(item, key) of state?.semo"
    >
      <span v-if="item[1] === 'itm'">获取 <span class="text-yellow-600 font-bold">{{ item[2] }}</span></span>
      <span v-if="item[1] === 'enemy'">迎战 <span class="text-yellow-600 font-bold">{{ item[2] }}</span></span>
      <span v-if="item[1] === 'corpse'">检查 <span class="text-yellow-600 font-bold">{{ item[2] }}</span> 的尸体</span>
    </div>
    <div
      @click="heal(item)"
      class="p-1 transition cursor-pointer bg-surfaceContainer ring-outlineVariant rounded hover:(ring-2)"
      v-for="item in state?.debuff"
    >
      <span>治疗 <span class="text-red-600 font-bold">{{ infInfo[item] }}</span></span>
    </div>
  </div>
</template>