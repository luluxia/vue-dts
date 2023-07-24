<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    let mergeBag: any[] = []
    let moveBag: any[] = []
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      if (gameState.playerState?.bag[key]) {
        mergeBag.push({
          key,
          item: gameState.playerState?.bag[key],
        })
        moveBag.push({
          key,
          item: gameState.playerState?.bag[key],
          isEmpty: false,
        })
      } else {
        moveBag.push({
          key,
          item: {
            name: '包裹' + (index + 1),
          },
          isEmpty: true,
        })
      }
    })
    return {
      bag: gameState.playerState.bag,
      mergeBag,
      moveBag,
    }
  }
})
const arrangeState = reactive({
  mergeList: new Set<any>(),
  moveList: new Set<any>(),
})
const mergeItemClick = (key: string) => {
  arrangeState.moveList.clear()
  if (arrangeState.mergeList.has(key)) {
    arrangeState.mergeList.delete(key)
  } else if (arrangeState.mergeList.size < 2) {
    arrangeState.mergeList.add(key)
  } else {
    arrangeState.mergeList.clear()
    arrangeState.mergeList.add(key)
  }
  if (arrangeState.mergeList.size === 2) {
    actionState.action = [
      { name: '合并', action: () => merge() },
      { name: '返回', action: () => back() },
    ]
  } else {
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  }
}
const moveItemClick = (item: any) => {
  arrangeState.mergeList.clear()
  if (arrangeState.moveList.has(item.key)) {
    arrangeState.moveList.delete(item.key)
  } else if (arrangeState.moveList.size < 2) {
    arrangeState.moveList.add(item.key)
  } else {
    arrangeState.moveList.clear()
    if (item.isEmpty) return
    arrangeState.moveList.add(item.key)
  }
  if (arrangeState.moveList.size === 2) {
    actionState.action = [
      { name: '移动', action: () => move() },
      { name: '返回', action: () => back() },
    ]
  } else {
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  }
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
const merge = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'itemmain',
    command: 'itemmerge',
    merge1: [...arrangeState.mergeList][0].replace('item', ''),
    merge2: [...arrangeState.mergeList][1].replace('item', ''),
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    arrangeState.mergeList.clear()
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  })
}
const move = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'itemmain',
    command: 'itemmove',
    from: [...arrangeState.moveList][0].replace('item', ''),
    to: [...arrangeState.moveList][1].replace('item', ''),
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    arrangeState.moveList.clear()
    actionState.action = [
      { name: '返回', action: () => back() },
    ]
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">整理</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">

  </div>
  <p class="font-bold">合并道具</p>
  <p class="mb-1">将两个可堆叠道具合并在一起</p>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="item in state?.mergeBag"
      @click="mergeItemClick(item.key as string)"
      :class="arrangeState.mergeList.has(item.key) && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span v-html="item.item?.name"></span>
    </p>
  </div>
  <p class="font-bold">移动道具</p>
  <p class="mb-1">移动道具在包裹内的位置</p>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="item in state?.moveBag"
      @click="moveItemClick(item)"
      :class="
        arrangeState.moveList.has(item.key) && 'ring-2 ring-outline',
        !item.item?.type && !arrangeState.moveList.size && 'opacity-50 pointer-events-none'
      "
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
    <span v-html="item.item?.name"></span>
    </p>
  </div>
</template>