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
    <div v-for="item in 20" class="flex space-x-1">
      <p class="text-zinc-500">[20:30]</p>
      <p>你来到了一片平原。</p>
    </div>
    <div class="flex space-x-1">
      <p class="text-zinc-500">[20:30]</p>
      <p>AC翻唱职人被参展者 admin埋设最终战术『心火』伏击炸死【各路党派 AC翻唱职人：“我觉得我还可以抢救一下……”】</p>
    </div>
  </div>
</template>