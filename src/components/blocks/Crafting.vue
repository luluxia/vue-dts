<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState, Item } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    const bag: {[key: string]: Item | null} = {}
    Object.keys(gameState.playerState.bag).forEach((key) => {
      if (gameState.playerState?.bag[key]) {
        bag[key] = gameState.playerState.bag[key]
      }
    })
    return {
      craftTips: gameState.playerState.craftTips,
      craftDialog: gameState.playerState.craftDialog,
      bag: bag,
    }
  }
})
const craftingState = reactive<{ list: Set<string | number>, showDialog: boolean }>({
  list: new Set(),
  showDialog: false,
})
const itemClick = (key: string | number) => {
  if (craftingState.list.has(key)) {
    craftingState.list.delete(key)
  } else {
    craftingState.list.add(key)
  }
}
onMounted(() => {
  actionState.action = [
    { name: '提交', action: () => craft() },
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
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const craft = async () => {
  const items: {[key: string]: string} = {}
  const list = Array.from(craftingState.list) as string[]
  list.forEach((key: string) => {
    const id = key.replace('item', '')
    items[`mitm${id}`] = id
  })
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'itemmix', ...items }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.actionLog.includes('不能合成')) {
      gameState.drawerType = ''
    }
  })
}
const itemIndex = ref('');
(window as any).$ = (tag: string) => {
  if (tag == 'itemindex') {
    return itemIndex
  }
}
(window as any).postCmd = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ itemindex: itemIndex.value }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    craftingState.showDialog = true
  })
}
</script>
<template v-else-if="state.drawerType == 'crafting'">
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">合成</h1>
  <p class="mb-1">合成笔记</p>
  <div class="crafting bg-surfaceContainer max-h-100 max-w-screen-lg p-2 rounded overflow-y-auto">
    <div v-if="state?.craftTips != '<br>'" v-html="state?.craftTips"></div>
    <span v-else>现在没有可以合成的物品</span>
  </div>
  <div class="mt-1" v-html="gameState.actionLog">

  </div>
  <p class="mb-1">你想要合成什么？</p>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="(item, key) in state?.bag"
      @click="itemClick(key as string)"
      :class="craftingState.list.has(key) && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span v-html="item?.name"></span>
    </p>
  </div>
  <Teleport to="body">
    <div
      class="fixed w-screen h-screen top-0 bg-black/40 z-2 shadow flex transition opacity-0 pointer-events-none"
      :class="craftingState.showDialog && '!opacity-100 !pointer-events-auto'"
      @click="craftingState.showDialog = false"
    >
      <div
        class="
          crafting craft-dialog bg-surfaceContainerHigh text-onSurface border-2 border-outline h-max max-w-300 m-auto p-4 rounded overflow-y-auto
          <md:(max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain)
        "
        v-html="state?.craftDialog"
      >

      </div>
    </div>
  </Teleport>
</template>
<style lang="postcss">
.crafting br:last-child {
  @apply hidden;
}
.crafting ul {
  @apply my-1 px-4 space-y-1;
}
.crafting ul:last-of-type {
  @apply mb-0;
}
.crafting li {
  @apply list-none;
}
.crafting .grey {
  @apply opacity-60;
}

</style>
