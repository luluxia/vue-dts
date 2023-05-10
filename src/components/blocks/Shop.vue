<script setup lang="ts">
import { inject, nextTick, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { createSingleton } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../../types/interface'
const shopTypes = [
  { id: 1, name: "补给品" },
  { id: 2, name: "药剂" },
  { id: 3, name: "钝器" },
  { id: 4, name: "锐器" },
  { id: 5, name: "远程兵器" },
  { id: 6, name: "投掷兵器" },
  { id: 7, name: "爆炸物" },
  { id: 8, name: "灵力兵器材料" },
  { id: 9, name: "防具" },
  { id: 10, name: "书籍" },
  { id: 11, name: "电子装备" },
  { id: 12, name: "杂物" },
  { id: 17, name: "限量福袋" },
  { id: 13, name: "埃克法轻工特供武器" },
  { id: 14, name: "林苍月的提示" },
  { id: 15, name: "Key社纪念品专卖" },
  { id: 16, name: "NPC解锁钥匙" },
  { id: 18, name: "上级者向物品" }
]
const gameState = inject<GameState>('state') as GameState
const shopItems = ref<any[]>([])
const buyNum = ref(1)
const shopType = ref<number>(1)
onMounted(() => {
  shopItems.value = gameState?.playerState?.shop || []
  createSingleton(tippy('.shop span[tooltip]', {
    interactive: true,
    content: (el) => {
      const content = el.getAttribute('tooltip') ? el.getAttribute('tooltip') : '暂无说明'
      return content as string
    },
    appendTo: () => document.body,
  }), {
    arrow: false,
    delay: 0,
    theme: 'crafting',
    moveTransition: 'transform 0.2s ease-out',
  })
})
const changeShopType = async (id: number) => {
  if (shopType.value === id) {
    return
  }
  shopType.value = id
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'special', command: 'shop' + id }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    if (data.playerState.shop) {
      shopItems.value = data.playerState.shop
    }
    nextTick(() => {
      createSingleton(tippy('.shop span[tooltip]', {
        interactive: true,
        content: (el) => {
          const content = el.getAttribute('tooltip') ? el.getAttribute('tooltip') : '暂无说明'
          return content as string
        },
        appendTo: () => document.body,
      }), {
        arrow: false,
        delay: 0,
        theme: 'crafting',
        moveTransition: 'transform 0.2s ease-out',
      })
    })
  })
}
const buy = async (itemId: string) => {
  const num = [1, 2, 6, 7, 8, 10, 11, 12].includes(shopType.value) ? buyNum.value : 1
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'shop', shoptype: shopType.value, command: itemId, buynum: num }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">商店</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog"></div>
  <div class="shop flex mb-2 rounded overflow-hidden bg-zinc-800/40 shadow">
    <div class="text-zinc-300 justify-center flex-wrap">
      <p class="bg-zinc-700/50 px-2.5 py-1 text-center mb-0.5">分类</p>
      <div class="h-102 space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
        <p
          v-for="item in shopTypes"
          class="px-2.5 py-1 snap-start cursor-pointer transition-colors hover:bg-zinc-700/50"
          :class="shopType === item.id && '!bg-zinc-700'"
          @click="changeShopType(item.id)"
        >{{ item.name }}</p>
      </div>
    </div>
    <div class="text-zinc-300 w-190 justify-center flex-wrap">
      <div class="flex bg-zinc-700/50 px-2.5 py-1 mb-0.5">
        <p class="flex-1 text-center">物品名</p>
        <p class="w-15 text-center">效果</p>
        <p class="w-15 text-center">耐久</p>
        <p class="w-15 text-center">库存</p>
        <p class="w-15 text-center mr-27.5">价格</p>
      </div>
      <div class="h-102 space-y-0.5 overflow-y-scroll overflow-x-hidden overscroll-contain snap snap-y">
        <div v-for="item in shopItems" class="flex px-2.5 py-1 snap-start group hover:bg-zinc-700/50">
          <p class="flex-1">
            <span class="text-zinc-400 mr-1">[<span v-html="item.itmk_words"></span>]</span>
            <span v-html="item.item_words"></span>
            <span v-if="item.itmsk_words"> / <span v-html="item.itmsk_words"></span></span>
          </p>
          <p class="w-15 text-center">{{ item.itme }}</p>
          <p class="w-15 text-center">{{ item.itms }}</p>
          <p class="w-15 text-center">{{ item.num }}</p>
          <p class="w-15 text-center">{{ item.price }}</p>
          <div class="w-25 text-sm flex justify-end h-6">
            <input
              v-if="[1, 2, 6, 7, 8, 10, 11, 12].includes(shopType)"
              class="bg-zinc-600 p-1 w-10 mr-2 rounded-sm opacity-0 group-hover:opacity-100"
              type="number"
              v-model="buyNum"
            >
            <div @click="buy(item.sid)" class="inline-flex items-center rounded-sm cursor-pointer transition bg-slate-600 opacity-30 group-hover:opacity-100 hover:bg-slate-500">
              <span class="m-auto px-2">购买</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss">
.shop span[tooltip].gold {
  @apply !block;
}
.shop span[tooltip] {
  @apply !inline;
}
.shop span[tooltip]::before {
  @apply !hidden;
}
/* .shop span[tooltip]::after {
  @apply !hidden;
} */
</style>