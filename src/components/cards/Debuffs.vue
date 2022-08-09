<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import Card from '../Card.vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      debuff: gameState.playerState.debuff
    }
  }
})
</script>

<template>
<template v-if="state">
<Card v-for="item in state.debuff" title="负面效果" :length="2">
  <div class="m-auto">
    <p class="text-xl">{{item}}</p>
  </div>
</Card>
</template>
</template>