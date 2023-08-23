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
        nowArea: mapData.find((item, index) => index == areaInfo.nowArea) || { x: 0, y: 0 },
      }
    } else {
      const areaNum = areaInfo.areaNum
      const areaAdd = areaInfo.areaAdd
      const nowAreaList = areaInfo.areaList.slice().splice(0, +areaNum + 1).map(item => Number(item))
      const nextAreaList = areaInfo.areaList.slice().splice(0, +areaNum + areaAdd + 1).map(item => Number(item))
      return {
        nowAreaList, nextAreaList, nowArea: mapData.find((item, index) => index == areaInfo.nowArea) || { x: 0, y: 0 },
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
  <div class="no-scroll-bar relative w-full overflow-x-auto overscroll-contain rounded">
    <div v-if="state" class="relative top-0 w-180 h-120 text-sm grid grid-cols-10 grid-rows-10 text-center">
      <img class="absolute w-full h-full object-cover rounded" src="https://llx.life/works/dts/img/map_new.jpg" alt="">
      <div class="absolute w-full h-full bg-onPrimaryFixedVariant/50 rounded"></div>
      <div class="absolute w-full border-t-1 border-dashed border-primaryContainer pointer-events-none opacity-80" :style="{ top: `${+state.nowArea.x * 3 - 1.5}rem` }"></div>
      <div class="absolute h-full border-l-1 border-dashed border-primaryContainer pointer-events-none opacity-80" :style="{ left: `${+state.nowArea.y * 4.5 - 2.25}rem` }"></div>
      <div class="absolute w-2 h-2 border-1 border-primaryContainer pointer-events-none opacity-80" :style="{ top: `${+state.nowArea.x * 3 - 1.75}rem`, left: `${+state.nowArea.y * 4.5 - 2.5}rem` }"></div>
      <p
        @click="moveTo(index)"
        class="relative flex justify-center items-center py-1 cursor-pointer font-bold" 
        :class="[
          `row-start-${item.x} col-start-${item.y}`,
          state.nowAreaList.includes(Number(index)) || (!index && !gameState.playerState?.area.isHack) ? 'text-red-500' : state.nextAreaList.includes(index) ? 'text-yellow-500' : 'text-green-500'
        ]"
        v-for="(item, index) of mapData"
        v-html="item.name"
      ></p>
    </div>
  </div>
</template>