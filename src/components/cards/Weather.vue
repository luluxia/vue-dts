<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.areaState) {
    return {
      weather: gameState.areaState.weather,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto">
  <p class="text-xl">{{state.weather}}</p>
</div>
</template>