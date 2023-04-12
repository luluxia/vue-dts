<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      ...gameState.playerState.level
    }
  }
})
</script>

<template>
  <template v-if="state">
    <div class="w-full h-1 bg-green-600 absolute bottom-0 opacity-10"></div>
    <div :style="{transform: `translate(-${((state.upgradeExp - state.exp) / state.upgradeExp) * 100}%, 0px)`}" class="w-full h-1 bg-green-600 absolute bottom-0 transition transition-transform"></div>
    <div class="m-auto text-center">
      <p class="text-2xl">{{ state.nowLevel }}</p>
      <p class="text-sm opacity-50">{{ state.exp }}/{{ state.upgradeExp }}</p>
    </div>
  </template>
</template>