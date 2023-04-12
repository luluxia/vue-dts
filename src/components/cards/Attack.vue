<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      attack: gameState.playerState.attack,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p v-html="state.attack" class="text-xl"></p>
</div>
</template>