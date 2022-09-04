<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.log) {
    return {
      log: gameState.log,
    }
  }
})
</script>
<template>
  <div v-if="state" class="max-w-152 h-72 overflow-y-auto text-zinc-200 px-1">
    <div v-for="item in state.log" class="flex space-x-1">
      <p class="text-zinc-500">[{{item.time}}]</p>
      <p>{{item.content}}</p>
    </div>
  </div>
</template>