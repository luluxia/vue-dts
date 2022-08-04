<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      tactic: gameState.playerState.tactic
    }
  }
})
</script>

<template>
<div class="m-auto">
  <p class="text-xl">{{state?.tactic}}</p>
</div>
</template>