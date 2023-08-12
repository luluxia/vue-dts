<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue'
import tippy, { hideAll } from 'tippy.js'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      itemBag: gameState.playerState.itemBag
    }
  }
})
const takeItem = async (key: any) => {
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
const itemBagRef = ref()
const itemBagListRef = ref()
onMounted(() => {
  tippy(itemBagRef.value, {
    content: itemBagListRef.value,
    interactive: true,
    allowHTML: true,
    arrow: false,
  })
})
</script>

<template>
  <template v-if="state">
    <div :class="!state.itemBag.isEquip && '!hidden'" class="flex justify-center transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)">
      <!-- 视野悬浮窗 -->
      <div ref="itemBagListRef" class="w-max space-y-0.5 text-base p-0.5">
        <div
          @click="takeItem(key)"
          class="p-1.5 transition cursor-pointer hover:(bg-primaryContainer)"
          v-for="(item, key) of state.itemBag.item"
        >
          <p><span>取出 </span><span class="text-yellow-600 font-bold">{{ item.itm }}</span></p>
        </div>
        <div v-if="state.itemBag.num == 0" class="p-2">背包内空无一物</div>
      </div>
      <div ref="itemBagRef" class="px-3 py-2">
        <p class="m-auto">背包<span class="text-sm opacity-60"> | {{ state.itemBag.num }}/{{ state.itemBag.limit }}</span></p>
      </div>
    </div>
  </template>
</template>