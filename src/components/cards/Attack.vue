<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      attack: gameState.playerState.attack
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p class="text-xl">{{state.attack}}</p>
  <p class="text-sm opacity-50">+50</p>
</div>
</template>