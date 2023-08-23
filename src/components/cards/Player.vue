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
  <img v-if="state.avatar" class="absolute object-cover h-full rounded" :src="`https://llx.life/works/dts/img/avatar/${state.avatar}`" alt="">
  <div class="m-auto px-1 relative w-full flex flex-col items-end">
    <p class="truncate tracking-wide bg-primaryContainer/80 text-onPrimaryContainer w-max px-1 rounded">{{ state.name }}</p>
    <p class="text-xs mt-1 px-1 opacity-80">{{ state.sex }}{{ state.id }}号</p>
  </div>
</div>
</template>