<script lang="ts" setup>
// import { computed } from 'vue'
import { inject, computed } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  //TODO 剩余人数为null
  if (gameState.playerState) {
    return {
      remain: gameState.playerState.area.aliveNum,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl">{{state.remain}}</p>
</div>
</template>