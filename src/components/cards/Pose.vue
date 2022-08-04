<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      pose: gameState.playerState.pose
    }
  }
})
</script>

<template>
<div class="m-auto">
  <p class="text-xl">{{state?.pose}}</p>
</div>
</template>