<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {...gameState.playerState.mp}
  }
})
</script>

<template>
<div v-if="state" :style="{transform: `translate(0px, ${((state.maxMp - state.nowMp) / state.maxMp) * 100}%)`}" class="w-full h-full bg-blue-500 absolute bottom-0 transition transition-transform"></div>
<div class="w-full h-full bg-blue-500 absolute bottom-0 opacity-20"></div>
<div class="m-auto text-center relative">
  <p>{{state?.nowMp}}</p>
  <p class="text-sm opacity-50">{{state?.maxMp}}</p>
</div>
<div class="absolute w-full h-full flex p-4">
  <img class="opacity-10 m-auto" src="/img/thunder.png" alt=""/>
</div>
</template>