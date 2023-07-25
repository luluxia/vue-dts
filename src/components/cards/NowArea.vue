<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import { mapData } from '../../utils/data'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      nowArea: mapData[gameState.playerState.area.nowArea].name,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p v-html="state.nowArea"></p>
</div>
</template>