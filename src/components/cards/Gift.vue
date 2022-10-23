<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      gift: gameState.playerState.gift
    }
  }
})
</script>

<template>
<div class="m-auto">
  <p class="text-xl">{{state?.gift}}</p>
</div>
</template>