<!-- 战术界面 -->
<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      horizon: gameState.playerState.horizon
    }
  }
})
</script>

<template>
<div class="m-auto">
  <p v-html="state?.horizon.type[Number(state.horizon.nowHorizonId)]"></p>
</div>
</template>