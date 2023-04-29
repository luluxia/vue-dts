<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState?.message) {
    return {
      message: Object.values(gameState.playerState?.message).reverse(),
    }
  }
})
</script>
<template>
  <div v-if="state" class="p-2 text-zinc-300">
    <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-700 border-b-2 border-dashed mb-1">
      消息<span class="text-base -ml-1 opacity-30">MESSAGE</span>
    </h1>
    <div v-for="item in state.message" class="message flex space-x-1" v-html="item">
    </div>
  </div>
</template>
<style lang="postcss">
.message span {
  @apply !font-normal;
}
</style>