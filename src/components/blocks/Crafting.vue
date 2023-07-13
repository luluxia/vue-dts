<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
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
  tippy('span[tooltip2]', {
    arrow: false,
    content: (el) => {
      const content = el.getAttribute('tooltip2') ? el.getAttribute('tooltip2') : '暂无说明'
      return content as string
    },
    theme: 'tooltip',
    appendTo: () => document.body,
  })
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
    nextTick(() => {
      tippy('.craft-dialog span[tooltip2]', {
        arrow: false,
        content: (el) => {
          const content = el.getAttribute('tooltip2') ? el.getAttribute('tooltip2') : '暂无说明'
          return content as string
        },
        theme: 'tooltip',
        appendTo: () => document.body,
      })
    })
  })
}
</script>
<template v-else-if="state.drawerType == 'crafting'">
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">合成</h1>
  <p class="text-zinc-400 mb-2">合成笔记</p>
  <div class="crafting text-zinc-300 bg-zinc-800/70 max-h-100 max-w-screen-lg p-4 rounded overflow-y-scroll" v-html="state?.craftTips">

  </div>
  <div class="text-zinc-400 mt-2" v-html="gameState.actionLog">

  </div>
  <p class="text-zinc-400 mb-2">你想要合成什么？</p>
  <div class="text-zinc-300 flex justify-center flex-wrap mb-2">
    <p
      v-for="(item, key) in state?.bag"
      @click="itemClick(key as string)"
      :class="craftingState.list.has(key) && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ item?.name }}</span>
    </p>
  </div>
  <Teleport to="body">
    <div
      class="fixed w-screen h-screen top-0 bg-black/70 z-1 shadow flex transition opacity-0 pointer-events-none"
      :class="craftingState.showDialog && '!opacity-100 !pointer-events-auto'"
      @click="craftingState.showDialog = false"
    >
      <div class="crafting craft-dialog text-zinc-300 bg-zinc-900/95 border-2 border-zinc-700 h-max max-w-300 m-auto p-4 rounded overflow-y-scroll" v-html="state?.craftDialog">

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
  @apply text-zinc-500;
}
.crafting .blueseed {
  @apply text-sky-300 font-bold;
}
/* .crafting span[tooltip2] {
  @apply relative inline-flex justify-center items-center w-max;
}
.crafting span[tooltip2]::after {
  content: '[?]';
  @apply text-sm opacity-50;
}
.crafting span[tooltip2]::before {
  content: attr(tooltip2);
  @apply bg-zinc-800/95 text-sm text-left p-2 fixed w-max max-w-70 border-2 text-zinc-200 border-zinc-600 z-1 whitespace-pre-line shadow opacity-0 pointer-events-none transition transition-opacity;
}
.crafting span[tooltip2]:hover::before {
  opacity: 1;
} */
</style>
