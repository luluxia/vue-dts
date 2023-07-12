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
const props = defineProps<{
  type: 'melee' | 'slash' | 'shoot' | 'throw' | 'blast' | 'spirit'
}>()
</script>

<template>
<div v-if="state" class="m-auto">
  <p class="text-xl">{{state.proficiency[props.type]}}</p>
  <!-- <p class="text-xl">
    <div class="flex items-center justify-center group">
      <span class="group-hover:opacity-0">100M</span>
      <span class="opacity-0 p-1 border-2 border-zinc-700 bg-zinc-800 text-base absolute group-hover:(opacity-100)">100000000</span>
    </div>
  </p> -->
</div>
</template>