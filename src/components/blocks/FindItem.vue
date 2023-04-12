<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import Card from '../Card.vue'
import Item from '../cards/Item.vue'
import { command } from '../../utils/api'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject('actionState') as any
const state = computed(() => {
  if (gameState.searchState && gameState.playerState) {
    let left = 6
    Object.keys(gameState.playerState.bag).forEach((key) => {
      if (gameState.playerState && gameState.playerState.bag[key]) {
        left--
      }
    })
    if (left > 0) {
      const action = actionState.action.filter((item: any) => item.name === '拾取')[0]
      if (action) {
        action.active = true
      }
    }
    return {
      findItem: gameState.searchState.findItem,
      left: left
    }
  }
})
onMounted(() => {
  actionState.oldAction = actionState.action
  // 判断合并物品
  let mergeFlag = false
  gameState.playerState && Object.keys(gameState.playerState?.bag).forEach((key, index) => {
    const item = gameState.playerState?.bag[key]
    if (item && item.name === state.value?.findItem?.name && item.quality === state.value?.findItem?.quality) {
      mergeFlag = true
      actionState.action = [
        { name: '拾取', action: () => getItem(), active: state.value && state.value.left > 0},
        { name: '与已有道具合并', action: () => mergeItem(index + 1) },
        { name: '丢弃', action: () => dropItem() },
      ]
    }
  })
  if (!mergeFlag) {
    actionState.action = [
      { name: '拾取', action: () => getItem(), active: state.value && state.value.left > 0},
      { name: '丢弃', action: () => dropItem() },
    ]
  }
})
// 拾取物品
const getItem = async () => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'itemget' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 丢弃物品
const dropItem = async () => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'dropitm0' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 合并物品
const mergeItem = async (index: number) => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'itemmerge', merge1: 0, merge2: index }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">发现物品</h1>
  <div v-if="gameState?.actionLog" v-html="gameState?.actionLog" class="text-zinc-400 mb-2"></div>
  <Card :length="4" :title="state?.findItem?.type" class="group transition hover:(ring-zinc-500 ring-2)">
    <Item v-if="state?.findItem" :item="state.findItem"/>
  </Card>
  <p v-if="!state?.left" class="text-zinc-400 mt-2">但是背包已满，你需要先腾出一个空位才能放下这个物品。</p>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>