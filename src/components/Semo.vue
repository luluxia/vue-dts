<script lang="ts" setup>
import { computed, inject } from 'vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      semo: gameState.playerState.semo
    }
  }
})
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
</script>

<template>
  <div class="flex space-x-1 justify-center">
    <div
      @click="memory(key)"
      class="p-1 transition cursor-pointer bg-surfaceContainer ring-outlineVariant rounded hover:(ring-2)"
      v-for="(item, key) of state?.semo"
    >
      <span v-if="item[1] === 'itm'">获取 <span class="text-yellow-600 font-bold">{{ item[2] }}</span></span>
      <span v-if="item[1] === 'enemy'">迎战 <span class="text-yellow-600 font-bold">{{ item[2] }}</span></span>
      <span v-if="item[1] === 'corpse'">检查 <span class="text-yellow-600 font-bold">{{ item[2] }}</span> 的尸体</span>
    </div>
  </div>
</template>