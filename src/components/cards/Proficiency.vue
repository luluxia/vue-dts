<script lang="ts" setup>
import { computed } from '@vue/reactivity'
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
</div>
</template>