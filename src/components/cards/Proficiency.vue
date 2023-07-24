<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      proficiency: gameState.playerState.proficiency
    }
  }
})
const type = {
  melee: '钝器',
  slash: '锐器',
  shoot: '枪械',
  throw: '投掷',
  blast: '爆炸',
  spirit: '灵力'
} as any
const max = computed(() => {
  let max = 0
  if (state.value) {
    for (const i in state.value.proficiency) {
      if (max < +state.value.proficiency[i]) {
        max = +state.value.proficiency[i]
      }
    }
  }
  return max
})
</script>

<template>
<div v-if="state" class="m-auto flex w-full h-full">
  <div class="flex-1 flex flex-col">
    <div v-for="i in ['melee', 'slash', 'shoot']" class="relative flex flex-1 items-center px-2 justify-between overflow-hidden">
      <div
        v-if="state.proficiency[i] != 0"
        class="absolute bg-primaryContainer w-full h-full top-0 left-0 transition transition-transform"
        :style="{ transform: `translate(-${100 - (state.proficiency[i] / max) * 100}%, 0px)` }"
      ></div>
      <p class="text-sm relative">{{ type[i] }}</p>
      <p class="text-sm relative">{{ state.proficiency[i] }}</p>
    </div>
  </div>
  <div class="flex-1 flex flex-col">
    <div v-for="i in ['throw', 'blast', 'spirit']" class="relative flex flex-1 items-center px-2 justify-between overflow-hidden">
      <div
        v-if="state.proficiency[i] != 0"
        class="absolute bg-primaryContainer w-full h-full top-0 left-0 transition transition-transform"
        :style="{ transform: `translate(-${100 - (state.proficiency[i] / max) * 100}%, 0px)` }"
      ></div>
      <p class="text-sm relative">{{ type[i] }}</p>
      <p class="text-sm relative">{{ state.proficiency[i] }}</p>
    </div>
  </div>
  <!-- <p class="text-xl">
    <div class="flex items-center justify-center group">
      <span class="group-hover:opacity-0">100M</span>
      <span class="opacity-0 p-1 border-2 border-zinc-700 bg-zinc-800 text-base absolute group-hover:(opacity-100)">100000000</span>
    </div>
  </p> -->
</div>
</template>