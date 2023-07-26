<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    let items: any[] = []
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      const item = gameState.playerState?.bag[key]
      if (item && (item.typeID?.indexOf('H') === 0 || item.typeID?.indexOf('P') === 0)) {
        items.push({
          key,
          item: gameState.playerState?.bag[key],
        })
      }
    })
    return {
      items
    }
  }
})
const usePoisonState = reactive({
  selectItemKey: '',
})
const selectItem = (item: any) => {
  usePoisonState.selectItemKey = item.key
  actionState.action = [
    { name: '对 ' + item.item.name + ' 下毒', action: () => usePoison() },
    { name: '放弃', action: () => back() },
  ]
}
onMounted(() => {
  actionState.action = [
    { name: '放弃', action: () => back() },
  ]
})
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'menu' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
const usePoison = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'item',
    command: 'itm' + usePoisonState.selectItemKey.replace('item', ''),
    usemode: 'poison',
    itmp: gameState.useItemKey?.replace('item', ''),
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">下毒</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">

  </div>
  <div class="mb-1 text-center">
    <p>你想对什么下毒？</p>
  </div>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="item in state?.items"
      @click="selectItem(item)"
      :class="usePoisonState.selectItemKey === item.key && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span v-html="item.item.name"></span>
    </p>
    <p class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 opacity-50" v-if="!state?.items.length">
      包裹中没有补给品
    </p>
  </div>
</template>