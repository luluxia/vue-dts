<script lang="ts" setup>
// import { computed } from 'vue'
import { inject, computed } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.areaState) {
    return {
      remain: gameState.areaState.remain,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl">{{state.remain}}</p>
</div>
</template>