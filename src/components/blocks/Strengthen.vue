<!-- 宝石强化 -->
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
      if (item && item.propsID?.includes('Z') && !['『灵魂宝石』', '『祝福宝石』'].includes(item.name)) {
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
const strengthenState = reactive({
  selectItemKey: '',
})
const selectItem = (item: any) => {
  strengthenState.selectItemKey = item.key
  actionState.action = [
    { name: '强化 ' + item.item.name, action: () => strengthen() },
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
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
const strengthen = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'item',
    usemode: 'qianghua',
    itmp: gameState.useItemKey?.replace('item', ''),
    command: 'itm' + strengthenState.selectItemKey.replace('item', ''),
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
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">强化</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog">

  </div>
  <template v-if="state?.items.length">
    <div class="text-zinc-400 mb-2 text-center">
      <p>宝石在你的手上发出异样的光芒，似乎有个奇怪的女声在你耳边说道<span class="yellow">“我是从天界来的凯丽”</span>。</p>
      <p>你想强化哪一件装备？</p>
    </div>
    <div class="text-zinc-300 flex justify-center flex-wrap mb-2">
      <p
        v-for="item in state?.items"
        @click="selectItem(item)"
        :class="strengthenState.selectItemKey === item.key && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span>{{ item.item.name }}</span>
      </p>
    </div>
  </template>
  <p class="text-zinc-400" v-else>唔？你的包裹里没有可以强化的装备，是不是没有脱下来呢？DA☆ZE</p>
</template>