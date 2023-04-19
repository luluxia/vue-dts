<script lang="ts" setup>
import { computed } from 'vue'
import { inject, ref, onMounted } from 'vue'
import { command } from '../utils/api'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      itemBag: gameState.playerState.itemBag
    }
  }
})
// 物品悬浮框
// const tippyRef = ref()
// onMounted(() => {
//   tippy('.tippy-bag', {
//     interactive: true,
//     arrow: false,
//     content: () => tippyRef.value,
//     allowHTML: true,
//     appendTo: () => document.body,
//   })
// })
const takeItem = async (key: any) => {
  hideAll()
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'usebagitm_' + key }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (data.searchState.findEnemy) {
      // 发现敌人
      gameState.drawerType = 'find-enemy'
    } else if (data.searchState.findItem) {
      // 发现物品
      gameState.drawerType = 'find-item'
    }
  })
}
</script>

<template>
  <template v-if="state">
    <div :class="!state.itemBag.isEquip && 'hidden'" class="flex justify-center transform transition-all top-0 cursor-pointer relative group-hover:(-top-1) group tippy-bag">
      <!-- 视野悬浮窗 -->
      <div class="absolute bottom-0 pb-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100 pointer-events-auto)">
        <div class="bg-zinc-800 border-2 border-zinc-600 rounded w-max space-y-0.5 text-base text-zinc-300 p-0.5" ref="tippyRef">
          <div
            @click="takeItem(key)"
            class="p-1.5 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)"
            v-for="(item, key) of state.itemBag.item"
          >
            <p><span>取出 </span><span class="text-yellow-600 font-bold">{{ item.itm }}</span></p>
          </div>
          <div v-if="state.itemBag.num == 0" class="p-2">背包内空无一物</div>
        </div>
      </div>
      <div class="text-zinc-300 px-4 py-2">
        <p class="m-auto">背包<span class="text-sm text-zinc-400"> | {{ state.itemBag.num }}/{{ state.itemBag.limit }}</span></p>
      </div>
    </div>
  </template>
</template>