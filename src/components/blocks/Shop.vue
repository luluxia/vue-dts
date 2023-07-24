<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { command } from '../../utils/api'
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
    command({ mode: 'special', command: 'shop' + shopType.value }).then(res => {
      const data = res as any
      if (data.playerState.shop) {
        shopItems.value = data.playerState.shop
      }
    })
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">商店</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog"></div>
  <div class="shop flex m1-2 rounded overflow-hidden bg-surfaceContainer">
    <div class="justify-center flex-wrap">
      <p class="bg-primaryContainer px-2.5 py-1 text-center mb-0.5">分类</p>
      <div class="h-102 space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
        <p
          v-for="item in shopTypes"
          class="px-2.5 py-1 snap-start cursor-pointer transition-colors hover:bg-surfaceContainerHigh"
          :class="shopType === item.id && '!bg-primaryContainer'"
          @click="changeShopType(item.id)"
        >{{ item.name }}</p>
      </div>
    </div>
    <div class="w-190 justify-center flex-wrap">
      <div class="flex bg-primaryContainer px-2.5 py-1 mb-0.5">
        <p class="flex-1 text-center">物品名</p>
        <p class="w-15 text-center">效果</p>
        <p class="w-15 text-center">耐久</p>
        <p class="w-15 text-center">库存</p>
        <p class="w-15 text-center mr-27.5">价格</p>
      </div>
      <div class="h-102 space-y-0.5 overflow-y-scroll overflow-x-hidden overscroll-contain snap snap-y">
        <div v-for="item in shopItems" class="flex px-2.5 py-1 snap-start group hover:bg-surfaceContainerHigh">
          <p class="flex-1">
            <span class="text-onSurfaceVariant mr-1">[<span v-html="item.itmk_words"></span>]</span>
            <span v-html="item.item_words"></span>
            <span v-if="item.itmsk_words"> / <span v-html="item.itmsk_words"></span></span>
          </p>
          <p class="w-15 text-center">{{ item.itme }}</p>
          <p class="w-15 text-center">{{ item.itms }}</p>
          <p class="w-15 text-center">{{ item.num }}</p>
          <p class="w-15 text-center">{{ item.price }}</p>
          <div class="w-25 text-sm flex justify-end">
            <input
              v-if="[1, 2, 6, 7, 8, 10, 11, 12].includes(shopType)"
              class="bg-surfaceDim px-1 w-10 mr-2 rounded-sm opacity-0 group-hover:opacity-100"
              type="number"
              v-model="buyNum"
            >
            <div @click="buy(item.sid)" class="inline-flex items-center rounded-sm cursor-pointer transition bg-primary text-onPrimary opacity-30 group-hover:opacity-100">
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
</style>