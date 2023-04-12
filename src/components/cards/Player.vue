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
<div v-if="state" class="flex w-full">
  <img v-if="state.avatar" class="avatar object-cover" :src="`http://localhost/phpdts/img/${state.avatar}`" alt="">
  <div class="flex-1 flex">
    <div class="m-auto">
      <p class="font-bold">{{ state.name }}</p>
      <p class="text-xs mt-1">{{ state.sex }}{{ state.id }}号</p>
    </div>
  </div>
</div>
</template>