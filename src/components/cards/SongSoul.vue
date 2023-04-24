<script lang="ts" setup>
import { computed } from 'vue';
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      songSoul: gameState.playerState.songSoul
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto">
  <p class="text-xl">{{ state.songSoul.nowSongSoul }}/{{ state.songSoul.maxSongSoul }}</p>
</div>
</template>