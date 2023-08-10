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
      gift: gameState.playerState.gift,
      horizon: gameState.playerState.horizon,
    }
  }
})
const change = async (type: 'tac' | 'pose' | 'clubsel' | 'hor', id: string) => {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">战术选择</h1>
  <!-- 基础姿态 -->
  <div class="mb-1">
    <p>基础姿态</p>
  </div>
  <div class="flex justify-center flex-wrap">
    <p
      v-for="id in state?.pose.idList"
      @click="change('pose', id)"
      :class="state?.pose.nowPoseId == id && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span :tooltip="state?.pose.tips[Number(id)]">{{ state?.pose.type[Number(id)] }}</span>
    </p>
  </div>
  <!-- 应战策略 -->
  <div class="my-1">
    <p>应战策略</p>
  </div>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="id in state?.tactic.idList"
      @click="change('tac', id)"
      :class="state?.tactic.nowTacticId == id && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span :tooltip="state?.tactic.tips[Number(id)]">{{ state?.tactic.type[Number(id)] }}</span>
    </p>
  </div>
  <!-- 战术界面 -->
  <div class="my-1">
    <p>战术界面</p>
  </div>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="(horizon, index) in state?.horizon.type"
      @click="change('hor', String(index))"
      :class="Number(state?.horizon.nowHorizonId) == index && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span>{{ horizon }}</span>
    </p>
  </div>
  <!-- 内定称号 -->
  <template v-if="state?.gift.nowGiftId == '0'">
    <div class="mb-1">
      <p>内定称号</p>
    </div>
    <div class="flex justify-center flex-wrap mb-1">
      <p
        v-for="id in state?.gift.giftList"
        @click="change('clubsel', id)"
        :class="state?.gift.nowGiftId == id && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
      >
        <span>{{ state?.gift.type[Number(id)] }}</span>
      </p>
    </div>
  </template>
</template>