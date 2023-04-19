<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
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
      battleState: gameState.searchState.findEnemy?.battleState,
    }
  }
})
const message = ref('')
onMounted(() => {
  if (state.value?.battleState === '发现敌人') {
    const attackType = gameState?.playerState?.attackType
    actionState.action = [
      { name: attackType?.type1.name || '', action: () => attack(attackType?.type1.id || '') },
    ]
    if (attackType?.type2.name) {
      actionState.action.push({ name: attackType.type2.name, action: () => attack(attackType.type2.id) })
    }
    actionState.action.push({ name: '切换', action: () => changeWeapon()})
    actionState.action.push({ name: '逃跑', action: () => back('revcombat') })
  } else if (state.value?.battleState === '遭遇突袭') {
    actionState.action = [
      { name: '确定', action: () => back('command') },
    ]
  } else {
    // 发现尸体
    const actionList: any = []
    state.value?.enemy?.actionList.forEach((name: string) => {
      actionList.push({ name: name, action: () => action(name) })
    })
    actionState.action = actionList
  }
})
// 攻击
const attack = async (type: string | null) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: type, message: message.value }).then(res => {
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
// 逃跑 / 确定
const back = async (mode: string) => {
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
// 切换武器
const changeWeapon = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: 'changewep' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog

    const attackType = gameState?.playerState?.attackType
    actionState.action = [
      { name: attackType?.type1.name || '', action: () => attack(attackType?.type1.id || '') },
    ]
    if (attackType?.type2.name) {
      actionState.action.push({ name: attackType.type2.name, action: () => attack(attackType.type2.id) })
    }
    actionState.action.push({ name: '切换', action: () => changeWeapon()})
    actionState.action.push({ name: '逃跑', action: () => back('revcombat') })
  })
}
const action = async (name: string) => {
  console.log(name)
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
    <img v-if="state.enemy.hasBigAvatar" class="h-57 border-2 border-zinc-700 mr-0.25" :src="`/old/img/${state.enemy.avatar}`" alt="">
      <div>
        <div class="flex">
        <Card :title="state.enemy.type" :length="2">
          <div class="flex w-full">
            <img v-if="!state.enemy.hasBigAvatar" class="absolute w-full h-full object-cover -z-1 opacity-20" :src="`/old/img/${state.enemy.avatar}`" alt="">
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
        <!-- 武器 -->
        <Card :length="4" :title="state.enemy.weaponType">
          <div class="flex w-full p-2 items-center">
            <div class="flex flex-col flex-1 h-full justify-between">
              <div class="ml-0.5">
                <p v-html="state.enemy.weapon" class="font-bold text-sm"></p>
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
  <template v-if="state?.battleState === '发现尸体'">
    <p class="text-zinc-400 mt-2">想要从尸体上拾取什么？</p>
    <div class="text-zinc-300 flex justify-center flex-wrap mt-2">
      <!-- <p
        v-for="(item, key) in state?.sameItems"
        @click=""
        :class="'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer"
      >
        <span>{{ item?.name }}</span>
      </p> -->
    </div>
  </template>
  <template v-if="state?.battleState === '发现敌人'">
    <p class="text-zinc-400 m-2">向对手大喊：</p>
    <input v-model="message" class="p-1 bg-zinc-700 text-zinc-300 rounded text-center" type="text">
  </template>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>