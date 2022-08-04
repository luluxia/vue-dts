<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.areaState) {
    return {
      nowArea: gameState.areaState.nowArea,
      remain: gameState.areaState.remain,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl">{{state.nowArea}}</p>
  <p class="text-sm text-zinc-400">剩余 {{state.remain}} 人</p>
</div>
</template>