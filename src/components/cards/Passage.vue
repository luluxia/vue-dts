<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    let passage = ''
    const nowArea = gameState.playerState.area.nowArea
    const areaNum = gameState.playerState.area.areaNum
    const areaAdd = gameState.playerState.area.areaAdd
    const nowAreaList = gameState.playerState.area.areaList.slice().splice(0, +areaNum)
    const nextAreaList = gameState.playerState.area.areaList.slice().splice(0, +areaNum + areaAdd)
    if (nowAreaList.includes(nowArea) || nowArea == 0) {
      passage = '禁区'
    } else if (nextAreaList.includes(nowArea)) {
      passage = '即将成为禁区'
    } else {
      passage = '正常通行'
    }
    return {
      passage: passage,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p v-if="state.passage === '禁区'" class="text-xl text-red-600">{{state.passage}}</p>
  <p v-else-if="state.passage === '即将成为禁区'" class="text-xl text-yellow-600">{{state.passage}}</p>
  <p v-else class="text-xl text-green-600">{{state.passage}}</p>
</div>
</template>