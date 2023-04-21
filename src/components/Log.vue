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
  <div v-if="state" class="max-w-152 h-50 overflow-y-auto text-zinc-200 px-1">
    <div v-for="item in state.message" class="message flex space-x-1" v-html="item">
    </div>
  </div>
</template>
<style lang="postcss">
.message span {
  @apply !font-normal;
}
</style>