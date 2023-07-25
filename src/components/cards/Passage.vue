<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    let passage = ''
    const areaInfo = gameState.playerState.area
    if (areaInfo.isHack == '1') {
      passage = '正常通行'
    } else {
      const nowArea = Number(areaInfo.nowArea)
      const areaNum = areaInfo.areaNum
      const areaAdd = areaInfo.areaAdd
      const nowAreaList = areaInfo.areaList.slice().splice(0, +areaNum + 1).map(item => Number(item))
      const nextAreaList = areaInfo.areaList.slice().splice(0, +areaNum + areaAdd + 1).map(item => Number(item))
      if (nowAreaList.includes(nowArea) || nowArea == 0) {
        passage = '禁区'
      } else if (nextAreaList.includes(nowArea)) {
        passage = '即将成为禁区'
      } else {
        passage = '正常通行'
      }
    }
    return {
      passage: passage,
    }
  }
})
</script>

<template>
<div v-if="state" class="m-auto text-center">
  <p v-if="state.passage === '禁区'" class="text-red-600">{{state.passage}}</p>
  <p v-else-if="state.passage === '即将成为禁区'" class="text-yellow-600">{{state.passage}}</p>
  <p v-else class="text-green-600">{{state.passage}}</p>
</div>
</template>