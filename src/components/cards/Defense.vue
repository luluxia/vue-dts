<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      defense: gameState.playerState.defense,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p v-html="state.defense" class="text-xl"></p>
</div>
</template>