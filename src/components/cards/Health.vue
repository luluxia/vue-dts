<script lang="ts" setup>
import { computed, inject } from 'vue'
import { command } from '../../utils/api'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      ...gameState.playerState.hp,
      ...gameState.playerState.mp,
      debuff: gameState.playerState.debuff
    }
  }
})
const infInfo = {
  b: { name: '胸部受伤', color: 'red' },
  h: { name: '头部受伤', color: 'red' },
  a: { name: '腕部受伤', color: 'red' },
  f: { name: '足部受伤', color: 'red' },
  p: { name: '中毒', color: 'purple' },
  u: { name: '灼伤', color: 'red' },
  i: { name: '冻伤', color: 'clan' },
  e: { name: '麻痹', color: 'yellow' },
  w: { name: '混乱', color: 'grey' }
} as any
const action = async (i: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'special', command: 'inf' + i }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
</script>

<template>
  <div class="w-full flex flex-col">
    <p class="text-sm m-auto px-2 text-center space-x-1">
      <template v-for="item in state?.debuff">
        <span
          v-if="infInfo[item]?.name && 'bhaf'.includes(item)"
          tooltip="消耗50体力包扎伤口"
          class="cursor-pointer !inline-block"
          :class="infInfo[item]?.color"
          @click="action(item)"
        >
          {{ infInfo[item].name }}
        </span>
        <span v-else-if="infInfo[item]?.name" class="inline-block" :class="infInfo[item]?.color">
          {{ infInfo[item].name }}
        </span>
      </template>
      <span v-if="state?.nowHp == 0" class="text-rose-600">停搏</span>
      <span v-else-if="!state?.debuff" class="text-green-600">状态良好</span>
    </p>
    <!-- 生命 -->
    <div class="w-full h-4 flex relative">
      <div class="absolute w-full">
        <div class="absolute w-full h-full bg-rose-500 opacity-10"></div>
        <div class="relative w-full text-xs text-rose-500 flex justify-between px-1">
          <span>生命</span>
          <span>{{ state?.nowHp }}/{{ state?.maxHp }}</span>
        </div>
      </div>
      <div
        v-if="state"
        class="absolute w-full transition-all"
        :style="{ clipPath: `inset(0 ${((state.maxHp - state.nowHp) / state.maxHp) * 100}% 0 0)` }"
      >
        <div class="absolute w-full h-full transition bg-rose-600"></div>
        <div class="relative w-full text-xs text-white flex justify-between px-1">
          <span>生命</span>
          <span>{{ state?.nowHp }}/{{ state?.maxHp }}</span>
        </div>
      </div>
    </div>
    <!-- 体力 -->
    <div class="w-full h-4 flex relative">
      <div class="absolute w-full">
        <div class="absolute w-full h-full bg-yellow-500 opacity-10"></div>
        <div class="relative w-full text-xs text-yellow-500 flex justify-between px-1">
          <span>体力</span>
          <span>{{ state?.nowMp }}/{{ state?.maxMp }}</span>
        </div>
      </div>
      <div
        v-if="state"
        class="absolute w-full transition-all"
        :style="{ clipPath: `inset(0 ${((state.maxMp - state.nowMp) / state.maxMp) * 100}% 0 0)` }"
      >
        <div class="absolute w-full h-full transition bg-yellow-600"></div>
        <div class="relative w-full text-xs text-white flex justify-between px-1">
          <span>体力</span>
          <span>{{ state?.nowMp }}/{{ state?.maxMp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>