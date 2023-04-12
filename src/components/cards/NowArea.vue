<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import gameData from '../../utils/data'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      nowArea: gameData.map[gameState.playerState.area.nowArea].name,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl" v-html="state.nowArea"></p>
</div>
</template>