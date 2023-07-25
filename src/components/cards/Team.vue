<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      team: gameState.playerState.team
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto">
  <p>{{ state.team || '无'}}</p>
</div>
</template>