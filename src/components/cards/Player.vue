<script lang="ts" setup>
import { inject, reactive, ref, watch, watchEffect } from 'vue'
import type { GameState, PlayerInfo } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
let state = reactive({}) as PlayerInfo
watchEffect(() => {
  if (gameState.playerState) {
    state = {...gameState.playerState.playerInfo}
  }
})
</script>

<template>
<div v-if="state.name" class="flex w-full">
  <img class="avatar object-cover" src="/img/m_1.gif" alt="">
  <div class="flex-1 flex">
    <div class="m-auto">
      <p class="font-bold">{{state.name || '玩家名称'}}</p>
      <p class="text-xs mt-1">{{state.sex}}生{{state.id}}号</p>
    </div>
  </div>
</div>
</template>