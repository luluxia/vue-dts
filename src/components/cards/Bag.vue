<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject, ref, onMounted } from 'vue'
import tippy, { createSingleton, hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import Card from '../Card.vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      bag: gameState.playerState.bag,
      money: gameState.playerState.money,
    }
  }
})
// 物品悬浮框
const tippyRef = ref()
onMounted(() => {
  createSingleton(tippy('.tippy', {
    content: () => tippyRef.value,
    allowHTML: true,
  }), {
    interactive: true,
    arrow: false,
    moveTransition: 'transform 0.2s ease-out',
    // delay: 100,
    trigger: 'click',
    animation: 'shift-away-subtle',
    appendTo: () => document.body,
  })
})
</script>

<template>
  <!-- 背包悬浮窗 -->
  <div class="hidden">
    <div class="w-max" ref="tippyRef">
      <div class="flex">
        <Card :length="4" :title="'爆炸物'" class="group transition hover:(ring-zinc-500 ring-2)">
            <div class="flex w-full p-2 items-center">
              <div class="w-16 h-16 rounded bg-zinc-900/50 mr-2">
                <img src="img/weapon1.png" alt=""/>
              </div>
              <div class="flex flex-col flex-1">
                <div class="ml-0.5">
                  <p class="font-bold text-sm">最终战术『心火』</p>
                  <p class="text-zinc-400 text-sm">菁英 连击 重击辅助 爆炸</p>
                </div>
                <p class="text-sm space-x-1 mt-1">
                  <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 123</span>
                  <span class="text-green-400 bg-zinc-900/50 rounded px-1.5 py-0.5">耐久 666</span>
                </p>
              </div>
            </div>
            <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
              <p class="m-auto text-xs px-3 py-1 bg-zinc-600 rounded">快捷</p>
              <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
            </div>
        </Card>
        <Card :length="4" :title="'物品'" class="group transition hover:(ring-zinc-500 ring-2)">
            <div class="p-1.5">
              <p>物品名</p>
            </div>
            <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
              <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
            </div>
        </Card>
      </div>
      <div class="flex">
        <Card :length="4" class="border-2 border-dashed"/>
        <Card :length="4" class="border-2 border-dashed"/>
      </div>
      <div class="flex">
        <Card :length="4" class="border-2 border-dashed"/>
        <Card :length="4" class="border-2 border-dashed"/>
      </div>
    </div>
  </div>
  <template v-if="state">
    <Card
      class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1) tippy group "
      title="背包" :length="2"
    >
      <div class="m-auto text-center">
        <p>空间 3 / 6</p>
        <p>金币 {{state.money}}</p>
      </div>
    </Card>
  </template>
</template>