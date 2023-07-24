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
    if (actionState.action[0].name == '拾取') {
      actionState.action[0].active = !isBagFull
    }
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
  actionState.action = [
    { name: '拾取', action: () => getItem() },
    { name: '使用', action: () => useItem() },
    { name: '提炼', action: () => splitItem(), id: 'element' },
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
  let commandSend: any = { mode: 'itemmain', command: 'itemget' }
  if (gameState.searchState?.findItem?.canMerge) {
    commandSend = { mode: 'itemmain', command: 'itemmerge', merge1: 0, merge2: 'n' }
  }
  await command(commandSend).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 使用物品
const useItem = async () => {
  gameState.useItemKey = '0'
  if (state.value?.findItem?.name === '毒药') {
    gameState.drawerType = 'use-poison'
    return
  } else if (state.value?.findItem?.name === '残响兵器') {
    gameState.drawerType = 'name-tag'
    return
  } else if (state.value?.findItem?.name && ['『灵魂宝石』', '『祝福宝石』'].includes(state.value.findItem.name)) {
    gameState.drawerType = 'strengthen'
    return
  }
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'itm0' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    if (data.playerState.radar) {
      gameState.drawerType = 'radar'
      return
    }
    gameState.searchState = data.searchState
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
// 提炼物品
const splitItem = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'split_itm0' }).then(res => {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">发现物品</h1>
  <div v-if="gameState?.actionLog" v-html="gameState?.actionLog" class="mb-2"></div>
  <Card :length="4" :title="state?.findItem?.type">
    <Item v-if="state?.findItem" :item="state.findItem"/>
  </Card>
  <template v-if="state?.isBagFull">
    <p class="mt-2">你的包裹已经满了。想要替换哪个物品？</p>
    <div class="flex justify-center flex-wrap mt-2">
      <p
        v-for="(item, key) in state?.bag"
        @click="selectDropItem(key)"
        :class="dropKey == key && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span v-html="item?.name"></span>
      </p>
    </div>
  </template>
  <template v-if="state?.sameItems && Object.keys(state?.sameItems).length">
    <p class="mt-2">发现了可以堆叠的物品。想要与哪个物品合并？</p>
    <div class="flex justify-center flex-wrap mt-2">
      <p
        v-for="(item, key) in state?.sameItems"
        @click="selectMergeItem(key)"
        :class="mergeKey == key && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span v-html="item?.name"></span>
      </p>
    </div>
  </template>
  <div class="mt-1">
    <p>现在想要做什么？</p>
  </div>
</template>