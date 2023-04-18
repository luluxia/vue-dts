<script lang="ts" setup>
import { inject, watch, ref, nextTick } from 'vue'

import Map from './blocks/Map.vue'
import Tactic from './blocks/Tactics.vue'
import FindItem from './blocks/FindItem.vue'
import FindEnemy from './blocks/FindEnemy.vue'
import Crafting from './blocks/Crafting.vue'

import Card from './Card.vue'
import gameData from '../utils/data'
import tippy, { createSingleton } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state', {
  showDrawer: false,
  drawerType: '',
  drawerHeight: 0,
})
const hoverDom = ref()
const tippyRef = ref()
let tippys = tippy('.tippy-tip', {
  content: '123',
  allowHTML: true,
})
const singleton = createSingleton(tippys, {
  interactive: true,
  arrow: false,
  moveTransition: 'transform 0.2s ease-out',
  animation: 'shift-away-subtle',
})
watch(() => state.showDrawer, (val) => {
  if (val) {
    nextTick(() => {
      state.drawerHeight = hoverDom.value.getClientRects()[0].height
      console.log(state.drawerHeight)
      tippys.forEach(item => item.destroy())
      tippys = tippy('.tippy-tip', {
        content: () => tippyRef.value.cloneNode(true),
        allowHTML: true,
      })
      console.log(tippys)
      singleton.setInstances(tippys)
    })
  } else {
    state.drawerHeight = 0
  }
})
watch(() => state.playerState, (val) => {
  nextTick(() => {
    state.drawerHeight = hoverDom.value.getClientRects()[0].height
    const timerDom = document.querySelector('#timer') as HTMLElement
    if (val && timerDom) {
      let num = 1
      const countdown = setInterval(function() {
        num -= 0.01
        timerDom.innerHTML = Math.abs(num).toFixed(2)
        if (num < 0) {
          clearInterval(countdown)
        }
      }, 10)
    }
  })
})
watch(() => state.drawerType, (val) => {
  nextTick(() => {
    state.drawerHeight = hoverDom.value.getClientRects()[0].height
  })
})
</script>
<template>
  <div class="hidden">
    <div class="flex" ref="tippyRef">
      <div>
        <p class="p-1 text-center">合成物品</p>
        <Card :length="2" :title="'物品'">
          <div class="p-1.5">
            <p>物品名</p>
          </div>
        </Card>
      </div>
      <div>
        <p class="p-1 text-center">需求材料</p>
        <div class="bg-zinc-700/50 text-zinc-300 p-2 h-28 rounded m-0.5">
          <p>材料1</p>
          <p>材料22</p>
          <p>材料333</p>
          <p>材料4444</p>
          <p>材料55555</p>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fixed bottom-0 w-screen flex bg-zinc-900/90 border-zinc-600/40 pb-2 border-t-2 transition transform duration-300"
    ref="hoverDom"
  >
    <div class="m-auto flex flex-col items-center pb-16">      <!-- 显示log -->
      <!-- 禁区 -->
      <template v-if="state.drawerType == 'forbidden-area'">
        <div v-if="state.playerState" class="text-zinc-400 text-center mt-2">
          <p>{{ gameData.map[state.playerState.area.nowArea].name }}是禁区，还是赶快逃跑吧！</p>
        </div>
      </template>
      <!-- 发现物品 -->
      <FindItem v-else-if="state.drawerType == 'find-item'" />
      <!-- 敌人相关 -->
      <FindEnemy v-else-if="state.drawerType == 'find-enemy'" />
      <!-- 地图 -->
      <Map v-else-if="state.drawerType == 'map'" />
      <!-- 合成 -->
      <Crafting v-else-if="state.drawerType == 'crafting'"/>
      <!-- 睡眠/治疗 -->
      <template v-else-if="['sleep', 'heal'].includes(state.drawerType as string)">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
          <template v-if="state.drawerType == 'sleep'">睡眠</template>
          <template v-else>治疗</template>
        </h1>
        <div class="text-zinc-400 text-sm mb-2">
          <template v-if="state.drawerType == 'sleep'">睡眠</template>
          <template v-else>治疗</template>
        </div>
      </template>
      <!-- 战术 -->
      <Tactic v-else-if="state.drawerType == 'tactics'"/>
      <!-- 商店 -->
      <template v-else-if="state.drawerType == 'shop'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">商店</h1>
        <div class="flex">
          <div class="text-zinc-300 justify-center flex-wrap">
            <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 text-center">分类</p>
            <div class="h-60 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">补给品</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">药剂</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">埃克法轻工特供商品</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
            </div>
          </div>
          <div class="text-zinc-300 w-150 justify-center flex-wrap">
            <div class="flex bg-zinc-700/50 px-2.5 py-1 rounded m-0.5">
              <p class="flex-1 text-center">物品名</p>
              <p class="w-20 text-center">库存</p>
              <p class="w-20 text-center mr-2.5">价格</p>
            </div>
            <div class="h-60 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
              <div class="flex px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">
                <p class="flex-1">物品名</p>
                <p class="w-20 text-center">20</p>
                <p class="w-20 text-center">50</p>
              </div>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-zinc-400 mt-2">
          <p v-html="state.actionLog"></p>
          <p class="text-center mt-1">现在想要做什么？</p>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="postcss">
.yellow {
  @apply text-yellow-600 font-bold;
}
.red {
  @apply text-red-600 font-bold;
}
.purple {
  @apply text-purple-600 font-bold;
}
</style>