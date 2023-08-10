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
      if (item && (item.typeID?.includes('H') || item.typeID?.includes('P'))) {
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
const checkPoisonState = reactive({
  selectItemKey: '',
})
const selectItem = (item: any) => {
  checkPoisonState.selectItemKey = item.key
  actionState.action = [
    { name: '检查 ' + item.item.name, action: () => checkPoison() },
    { name: '返回', action: () => back() },
  ]
}
onMounted(() => {
  actionState.action = [
    { name: '返回', action: () => back() },
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
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const checkPoison = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'special',
    command: 'chkp' + checkPoisonState.selectItemKey.replace('item', ''),
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">检查毒物</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">

  </div>
  <div class="mb-1 text-center">
    <p>选择一份背包中的补给品，检查其是否带毒</p>
    <p>想检查什么？</p>
  </div>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="item in state?.items"
      @click="selectItem(item)"
      :class="checkPoisonState.selectItemKey === item.key && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span v-html="item.item.name"></span>
    </p>
    <p class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 opacity-50" v-if="!state?.items.length">
      包裹中没有补给品
    </p>
  </div>
</template>