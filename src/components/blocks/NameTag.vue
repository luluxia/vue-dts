<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    let items: any[] = []
    Object.keys(gameState.playerState.equipment).forEach((key, index) => {
      const item = (gameState.playerState?.equipment as {[key: string]: any})[key]
      if ((['weapon', 'armor'].includes(key) ? item.quality != 0 : true) && item.durability != 0) {
        items.push({
          key,
          item: item,
        })
      }
    })
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      const item = gameState.playerState?.bag[key]
      if (item && !item.typeID?.includes('Y') && !item.typeID?.includes('Z')) {
        items.push({
          key,
          item: item,
        })
      }
    })
    return {
      items
    }
  }
})
const nameTagState = reactive({
  selectItemKey: '',
  rename: '',
})
const selectItem = (item: any) => {
  nameTagState.selectItemKey = item.key
  actionState.action = [
    { name: '为 ' + item.item.name + ' 改名', action: () => nameTag() },
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
const nameTag = async () => {
  const key = nameTagState.selectItemKey
  const index = ['weapon', 'armor', 'helmet', 'arm', 'boot', 'accessory', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6'].indexOf(key)
  const target = ['wep', 'arb', 'arh', 'ara', 'arf', 'art', 'itm1', 'itm2', 'itm3', 'itm4', 'itm5', 'itm6'][index]
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'item',
    command: 'ren' + target,
    usemode: 'nametag',
    ntitm: gameState.useItemKey?.replace('item', ''),
    rename: nameTagState.rename,
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">命名</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">

  </div>
  <div class="mb-1 text-center">
    <p>你想修改哪个道具的名字？</p>
  </div>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="item in state?.items"
      @click="selectItem(item)"
      :class="nameTagState.selectItemKey === item.key && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span v-html="item.item.name"></span>
    </p>
    <p class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 opacity-50" v-if="!state?.items.length">
      没有可改名的道具
    </p>
  </div>
  <p class="mb-1">修改为：</p>
  <input v-model="nameTagState.rename" class="p-1 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-center" type="text">
</template>