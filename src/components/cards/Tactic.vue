<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      tactic: gameState.playerState.tactic.nowTactic
    }
  }
})
</script>

<template>
<div class="m-auto">
  <p v-html="state?.tactic"></p>
</div>
</template>