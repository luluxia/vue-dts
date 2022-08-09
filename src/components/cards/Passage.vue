<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.areaState) {
    return {
      passage: gameState.areaState.passage,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl">{{state.passage}}</p>
</div>
</template>