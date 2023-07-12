<script setup lang="ts">
import { computed, inject } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      tactic: gameState.playerState.tactic,
      pose: gameState.playerState.pose,
      gift: gameState.playerState.gift
    }
  }
})
const change = async (type: 'tac' | 'pose' | 'clubsel', id: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'special', command: type + id }).then(res => {
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
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">战术选择</h1>
  <!-- 基础姿态 -->
  <div class="text-zinc-400 mb-2">
    <p>基础姿态</p>
  </div>
  <div class="text-zinc-300 flex w-200 justify-center flex-wrap">
    <p
      v-for="id in state?.pose.idList"
      @click="change('pose', id)"
      :class="state?.pose.nowPoseId == id && 'ring-2 ring-zinc-500'"
      class="tooltip-down bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer"
    >
      <span :tooltip="state?.pose.tips[Number(id)]">{{ state?.pose.type[Number(id)] }}</span>
    </p>
  </div>
  <!-- 应战策略 -->
  <div class="text-zinc-400 my-2">
    <p>应战策略</p>
  </div>
  <div class="text-zinc-300 flex w-200 justify-center flex-wrap mb-2">
    <p
      v-for="id in state?.tactic.idList"
      @click="change('tac', id)"
      :class="state?.tactic.nowTacticId == id && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer"
    >
      <span :tooltip="state?.tactic.tips[Number(id)]">{{ state?.tactic.type[Number(id)] }}</span>
    </p>
  </div>
  <!-- 内定称号 -->
  <template v-if="state?.gift.nowGiftId == '0'">
    <div class="text-zinc-400 mb-2">
      <p>内定称号</p>
    </div>
    <div class="text-zinc-300 flex w-200 justify-center flex-wrap mb-2">
      <p
        v-for="(id, index) in state?.gift.giftList"
        @click="change('clubsel', String(index))"
        :class="state?.gift.nowGiftId == id && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer"
      >
        <span>{{ state?.gift.type[Number(id)] }}</span>
      </p>
    </div>
  </template>
</template>