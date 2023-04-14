<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import Card from '../Card.vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.searchState) {
    return {
      actionLog: gameState.actionLog,
      enemy: gameState.searchState.findEnemy,
    }
  }
})
onMounted(() => {
  if (gameState?.searchState?.findEnemy?.battleState === '发现敌人') {
    const attackType = gameState?.playerState?.attackType
    actionState.action = [
      { name: attackType?.type1.name || '', action: () => attack(attackType?.type1.id || '') },
    ]
    if (attackType?.type2.name) {
      actionState.action.push({ name: attackType.type2.name, action: () => attack(attackType.type2.id) })
    }
    actionState.action.push({ name: '逃跑', action: () => back('revcombat') })
  } else {
    actionState.action = [
      { name: '确定', action: () => back('command') },
    ]
  }
})
// 攻击
const attack = async (type: string | null) => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: type }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    actionState.action = [
      { name: '确定', action: () => back('command') },
    ]
  })
}
const back = async (mode: string) => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: mode, command: 'back' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
    {{ state?.enemy?.battleState }}
  </h1>
  <div class="text-zinc-400 mb-2">
    <p v-html="state?.actionLog"></p>
  </div>
  <div v-if="state?.enemy" class="flex">
    <img class="h-57 border-2 border-zinc-700 mr-0.25" :src="`http://dts.llx.life/old/img/${state.enemy.avatar}`" alt="">
      <div>
        <div class="flex">
        <Card :title="state.enemy.type" :length="2">
          <div class="flex w-full">
            <div class="flex-1 flex">
              <div class="m-auto">
                <p class="font-bold">{{ state.enemy.name }}</p>
                <p class="text-xs mt-1">{{ state.enemy.title }}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card title="等级">
          <div class="m-auto text-center">
            <p class="text-2xl">{{ state.enemy.level }}</p>
          </div>
        </Card>
        <!-- 生命 -->
        <Card title="生命">
          <div class="m-auto text-center">
            <p v-html="state.enemy.hp"></p>
          </div>
        </Card>
        <!-- 体力 -->
        <Card title="体力">
          <div class="m-auto text-center">
            <p v-html="state.enemy.mp"></p>
          </div>
        </Card>
        <!-- 怒气 -->
        <Card title="怒气">
          <div class="m-auto text-center">
            <p v-html="state.enemy.rage"></p>
          </div>
        </Card>
        <!-- 受伤部位 -->
        <Card title="受伤部位" :length="2">
          <div class="flex w-full">
            <div class="flex-1 flex">
              <div class="m-auto">
                <p v-html="state.enemy.hurt"></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="flex">
        <!-- 基础姿态 -->
        <Card title="基础姿态" :length="2">
          <div class="m-auto text-center">
            <p v-html="state.enemy.tactic"></p>
          </div>
        </Card>
        <!-- 应战策略 -->
        <Card title="应战策略" :length="2">
          <div class="m-auto text-center">
            <p v-html="state.enemy.pose"></p>
          </div>
        </Card>
        <Card :length="4" :title="state.enemy.weaponType">
          <div class="flex w-full p-2 items-center">
            <div class="flex flex-col flex-1 h-full justify-between">
              <div class="ml-0.5">
                <p class="font-bold text-sm">{{ state.enemy.weapon }}</p>
              </div>
              <p class="text-sm space-x-1 mt-1">
                <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 {{ state.enemy.attack }}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>