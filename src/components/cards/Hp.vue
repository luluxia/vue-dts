<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {...gameState.playerState.hp}
  }
})
</script>

<template>
<div v-if="state" :style="{transform: `translate(0px, ${((state.maxHp - state.nowHp) / state.maxHp) * 100}%)`}" class="w-full h-full bg-green-600 absolute bottom-0 transition transition-transform"></div>
<div class="w-full h-full bg-green-600 absolute bottom-0 opacity-20"></div>
<div class="m-auto text-center relative">
  <p>{{state?.nowHp}}</p>
  <p class="text-sm opacity-50">{{state?.maxHp}}</p>
</div>
<!-- <div class="absolute w-full h-full flex p-2">
  <img class="opacity-10 m-auto" src="https://llx.life/works/dts/img/heart.png" alt=""/>
</div> -->
</template>