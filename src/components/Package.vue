<script setup lang="ts">
import { inject } from 'vue'
import Card from './Card.vue'
import Item from './cards/Item.vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state') as GameState
// 使用物品
const useItem = async (item: any, key: any) => {
  if (item.name === '毒药') {
    state.drawerType = 'use-poison'
    state.useItemKey = key
    return
  } else if (item.name === '残响兵器') {
    state.drawerType = 'name-tag'
    state.useItemKey = key
    return
  } else if (['『灵魂宝石』', '『祝福宝石』'].includes(item.name)) {
    state.drawerType = 'strengthen'
    state.useItemKey = key
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: key.replace('e', '') }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    if (data.playerState.radar) {
      state.drawerType = 'radar'
    } else {
      state.drawerType = ''
    }
  })
}
// 丢弃物品
const dropItem = async (key: any) => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `drop${key.replace('e', '')}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
  })
}
// 存入背包
const encaseItem = async (key: any) => {
  const index = key.replace('item', '')
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'itemencase', [`mitm${index}`]: index }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
  })
}
// 提炼物品
const splitItem = async (key: any) => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `split_itm${key.replace('item', '')}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
    state.drawerType = ''
  })
}
</script>
<template>
  <Card
    v-for="(item, key) of state.playerState?.bag"
    @click="useItem(item, key)"
    :title="item?.name && item.type" :length="4"
    :class="`${item?.name ? 'cursor-pointer' : 'pointer-events-none opacity-40'}`"
  >
    <Item v-if="item" :item='item'/>
    <div v-if="item" class="absolute right-1 bottom-1 space-y-1 text-center transition opacity-0 group-hover:(opacity-100)">
      <p
        v-if="state.playerState?.itemBag.isEquip"
        @click.stop="encaseItem(key)"
        class="
          text-xs px-2 py-1 rounded-sm transition
          bg-primary text-onPrimary
          hover:bg-primary/60
        "
      >存入背包</p>
      <div class="flex space-x-1">
        <p
          @click.stop="dropItem(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-tertiary text-onTertiary
            hover:bg-tertiary/60
          "
        >丢弃</p>
        <p
          v-if="state.playerState?.canAction['element']"
          @click.stop="splitItem(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-secondary text-onSecondary
            hover:bg-secondary/60
          "
        >提炼</p>
      </div>
    </div>
  </Card>
</template>