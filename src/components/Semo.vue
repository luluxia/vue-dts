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
      semo: gameState.playerState.semo
    }
  }
})
// 物品悬浮框
const tippyRef = ref()
onMounted(() => {
  tippy('.tippy-semo', {
    interactive: true,
    arrow: false,
    content: () => tippyRef.value,
    allowHTML: true,
    appendTo: () => document.body,
  })
})
const memory = async (key: any) => {
  hideAll()
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'memory' + key }).then(res => {
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
  <!-- 视野悬浮窗 -->
  <div class="hidden">
    <div v-if="state" class="w-max space-y-0.5 text-base text-zinc-300" ref="tippyRef">
      <div
        @click="memory(key)"
        class="p-1.5 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)"
        v-for="(item, key) of state.semo"
      >
        <span v-if="item[1] === 'itm'">获取 <span class="text-yellow-600 font-bold">{{ item[2] }}</span></span>
      </div>
      <div v-if="state.semo && Object.keys(state.semo).length === 0 || !state.semo" class="p-2">视野内空无一物</div>
    </div>
  </div>
  <template v-if="state">
    <div class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1) group tippy-semo">
      <div class="text-zinc-300 px-4 py-2">
        <p class="m-auto">视野</p>
      </div>
    </div>
  </template>
</template>