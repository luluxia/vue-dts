<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import gameData from '../../utils/data'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      weather: gameData.weather[gameState.playerState.area.weather],
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto">
  <p class="text-xl">{{state.weather}}</p>
</div>
</template>