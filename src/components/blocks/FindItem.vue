<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import Card from '../Card.vue'
import Item from '../cards/Item.vue'
import { command } from '../../utils/api'
import type { GameState, Item as ItemType } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject('actionState') as any
const state = computed(() => {
  if (gameState.searchState && gameState.playerState) {
    const findItem = gameState.searchState.findItem
    // 判断背包是否已满 筛选背包中不为空的物品 筛选背包中与发现物品可合并的物品
    let isBagFull = true
    const bag: {[key: string]: ItemType | null} = {}
    const sameItems: {[key: string]: ItemType | null} = {}
    Object.keys(gameState.playerState.bag).forEach((key) => {
      if (gameState.playerState?.bag[key]) {
        const item = gameState.playerState.bag[key]
        bag[key] = item
        // 相同名字 相同品质
        if (item?.name === findItem?.name && item?.quality === findItem?.quality && findItem?.canMerge) {
          sameItems[key] = item
        }
      } else {
        isBagFull = false
      }
    })
    actionState.action[0].active = !isBagFull
    return {
      findItem: findItem,
      isBagFull: isBagFull,
      sameItems: sameItems,
      bag: bag,
    }
  }
})
const dropKey = ref<any>('')
const mergeKey = ref<any>('')
onMounted(() => {
  actionState.oldAction = actionState.action
  actionState.action = [
    { name: '拾取', action: () => getItem() },
    { name: '丢弃', action: () => dropItem() },
  ]
})
const selectDropItem = (key: any) => {
  dropKey.value = key
  mergeKey.value = ''
  actionState.action[0].name = '替换 ' + gameState.playerState?.bag[key]?.name
  actionState.action[0].action = () => swapItem(key.replace('item', ''))
  actionState.action[0].active = true
}
const selectMergeItem = (key: any) => {
  dropKey.value = ''
  mergeKey.value = key
  actionState.action[0].name = '与 ' + gameState.playerState?.bag[key]?.name + ' 合并'
  actionState.action[0].action = () => mergeItem(key.replace('item', ''))
  actionState.action[0].active = true
}
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
// 替换物品
const swapItem = async (index: string) => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `swapitm${index}` }).then(res => {
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
  <template v-if="state?.isBagFull">
    <p class="text-zinc-400 mt-2">你的包裹已经满了。想要替换哪个物品？</p>
    <div class="text-zinc-300 flex justify-center flex-wrap mt-2">
      <p
        v-for="(item, key) in state?.bag"
        @click="selectDropItem(key)"
        :class="dropKey == key && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span>{{ item?.name }}</span>
      </p>
    </div>
  </template>
  <template v-if="state?.sameItems && Object.keys(state?.sameItems).length">
    <p class="text-zinc-400 mt-2">发现了可以堆叠的物品。想要与哪个物品合并？</p>
    <div class="text-zinc-300 flex justify-center flex-wrap mt-2">
      <p
        v-for="(item, key) in state?.sameItems"
        @click="selectMergeItem(key)"
        :class="mergeKey == key && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span>{{ item?.name }}</span>
      </p>
    </div>
  </template>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>