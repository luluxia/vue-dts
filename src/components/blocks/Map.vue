<script setup lang="ts">
import { inject, computed } from 'vue'
import { mapData } from '../../utils/data'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    const areaInfo = gameState.playerState.area
    if (areaInfo.isHack == '1') {
      return {
        nowAreaList: [],
        nextAreaList: [],
      }
    } else {
      const areaNum = areaInfo.areaNum
      const areaAdd = areaInfo.areaAdd
      const nowAreaList = areaInfo.areaList.slice().splice(0, +areaNum + 1).map(item => Number(item))
      const nextAreaList = areaInfo.areaList.slice().splice(0, +areaNum + areaAdd + 1).map(item => Number(item))
      return {
        nowAreaList, nextAreaList
      }
    }
  }
})
const moveTo = async (index: number) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({mode: 'command', command: 'move', moveto: index }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
    actionState.action.forEach(item => {
      item.active = true
    })
  })
}
</script>
<template>
  <img class="w-200 h-140" src="/img/map.png" alt="">
  <div v-if="state" class="fixed w-200 px-10 py-10 text-zinc-200 text-sm text-shadow-sm grid grid-cols-10 grid-rows-10 text-center">
    <p
      @click="moveTo(index)"
      class="flex justify-center items-center py-1 cursor-pointer" 
      :class="[
        `row-start-${item.x} col-start-${item.y}`,
        state.nowAreaList.includes(Number(index)) || (!index && !gameState.playerState?.area.isHack) ? 'text-red-500' : state.nextAreaList.includes(index) ? 'text-yellow-500' : 'text-green-500'
      ]"
      v-for="(item, index) of mapData"
      v-html="item.name"
    ></p>
  </div>
</template>