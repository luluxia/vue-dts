<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {...gameState.playerState.playerInfo}
  }
})
</script>

<template>
<div v-if="state" class="flex w-full h-full">
  <img v-if="state.avatar" class="absolute object-cover h-full avatar" :src="`/old/img/${state.avatar}`" alt="">
  <div class="m-auto px-4 relative w-full flex flex-col items-end">
    <p class="font-bold truncate tracking-wide bg-zinc-800/80 w-max px-1 rounded">{{ state.name }}</p>
    <p class="text-xs mt-1 px-1">{{ state.sex }}{{ state.id }}号</p>
  </div>
</div>
</template>