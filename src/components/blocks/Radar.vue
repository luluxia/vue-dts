<script lang="ts" setup>
import { computed, inject, onMounted } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const radar = computed(() => gameState.playerState?.radar)
onMounted(() => {
  actionState.action = [
    { name: '返回', action: () => back() },
  ]
})
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'menu' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">雷达</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog"></div>
  <div class="radar text-zinc-400 rounded bg-zinc-800/40 max-h-100 overflow-y-scroll overscroll-contain mb-1" v-html="radar"></div>
</template>
<style lang="postcss">
.radar td {
  @apply p-2;
}
.radar tr:nth-child(1) {
  @apply sticky top-0;
}
.radar tr:nth-child(odd) {
  @apply bg-zinc-800/60;
}
.radar tr {
  @apply transition-colors;
}
.radar tr:hover {
  @apply bg-zinc-700/50;
}
.radar .nttx {
  width: max-content;
  margin: 0 auto;
}
</style>