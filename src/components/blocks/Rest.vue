<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
onMounted(() => {
  actionState.action = [
    { name: gameState.playerState?.rest || '', action: () => rest() },
    { name: '返回', action: () => back() },
  ]
})
const rest = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'rest', command: 'rest' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'rest', command: 'back' }).then(res => {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">{{ gameState.playerState?.rest }}</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">
  </div>
  <p>{{ gameState.playerState?.rest }}中……</p>
</template>