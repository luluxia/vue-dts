<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    let bag: any[] = []
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      if (gameState.playerState?.bag[key]) {
        bag.push({
          key,
          item: gameState.playerState?.bag[key],
        })
      }
    })
    return {
      bag,
      depot: gameState.playerState.depotItems,
    }
  }
})
const depotState = reactive({
  selectType: 'save',
  selectBagItem: '',
  selectDepotItem: '',
  selectDepotItemKey: 0,
})
const bagItemClick = (item: any) => {
  depotState.selectBagItem = item.key
  depotState.selectDepotItem = ''
  actionState.action = [
    { name: '存放 ' + item.item.name, action: () => saveItem() },
    { name: '返回', action: () => back() },
  ]
}
const depotItemClick = (item: any, key: number) => {
  depotState.selectDepotItemKey = key
  depotState.selectDepotItem = item.iid
  depotState.selectBagItem = ''
  actionState.action = [
    { name: '取出 ' + item.itm, action: () => loadItem() },
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
const saveItem = async () => {
  console.log(depotState.selectBagItem)
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'depot',
    command: 'saveitem_' + depotState.selectBagItem.replace('item', ''),
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    depotState.selectBagItem = ''
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  })
}
const loadItem = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'depot',
    command: 'loaditem_' + depotState.selectDepotItemKey,
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    depotState.selectDepotItem = ''
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">安全箱</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog">

  </div>
  <div class="text-zinc-400">
    <p>你在某个不起眼的角落发现了一个黑乎乎的匣子。</p>
    <p>当你靠近时，匣子上方投影出了一段文字。</p>
    <p>从屏幕上的内容来看，你似乎可以把道具存放在这个「绝对安全」的匣子里。</p>
    <p>那么……该怎么做呢？</p>
  </div>
  <!-- 存放道具 -->
  <p class="text-zinc-300 font-bold">存放道具</p>
  <div class="text-zinc-400 mb-2 text-center">
    <p>选择该功能，可以将身上的道具<span class="yellow">储存</span>在安全箱中进行保管。</p>
    <p>储存的道具<span class="yellow">不可堆叠</span>， 请在储存前将其整理好。储存道具的手续费为每件<span class="yellow">20</span>元。</p>
  </div>
  <div class="text-zinc-300 flex justify-center flex-wrap mb-2">
    <p
      v-for="item in state?.bag"
      @click="bagItemClick(item)"
      :class="depotState.selectBagItem === item.key && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ item.item?.name }}</span>
    </p>
    <p class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 opacity-50" v-if="!state?.bag.length">
      包裹中没有道具
    </p>
  </div>
  <!-- 取出道具 -->
  <p class="text-zinc-300 font-bold">取出道具</p>
  <div class="text-zinc-400 mb-2 text-center">
    <p>选择该功能，可以将储存在安全箱中的道具<span class="yellow">取出</span>。</p>
    <p>取出道具时，会收取一定的保管费，保管费用为每件<span class="yellow">220</span>元。</p>
  </div>
  <div class="text-zinc-300 flex justify-center flex-wrap mb-2">
    <p
      v-for="(item, key) in state?.depot"
      @click="depotItemClick(item, key)"
      :class="depotState.selectDepotItem === item.iid && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ item.itm }}</span>
    </p>
    <p class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 opacity-50" v-if="!state?.depot.length">
      安全箱中没有道具
    </p>
  </div>
</template>