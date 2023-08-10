<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import Card from '../Card.vue'
import { command } from '../../utils/api'
import type { GameState, ActionState, Item } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.searchState && gameState.playerState) {
    const bag: {[key: string]: Item | null} = {}
    Object.keys(gameState.playerState.bag).forEach((key) => {
      if (gameState.playerState?.bag[key]) {
        bag[key] = gameState.playerState.bag[key]
      }
    })
    return {
      actionLog: gameState.actionLog,
      team: gameState.searchState.findTeam,
      bag: bag,
    }
  }
})
onMounted(() => {
  actionState.action = [
    { name: '返回', action: () => back() },
  ]
})
const message = ref('')
const chooseItemKey = ref('')
const chooseItem = (name: string, key: any) => {
  chooseItemKey.value = key
  actionState.action = [
    { name: '转让' + name, action: () => senditem(key) },
    { name: '返回', action: () => back() },
  ]
}
const senditem = async (key: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'senditem', command: key.replace('item', 'itm'), message: message.value }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.searchState = data.searchState
    gameState.drawerType = ''
  })
}
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'senditem', command: 'back' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.searchState = data.searchState
    gameState.drawerType = ''
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">
    发现队友
  </h1>
  <div class="mb-1">
    <p v-html="state?.actionLog"></p>
  </div>
  <!-- 敌人信息 -->
  <div v-if="state?.team">
    <div class="flex">
      <Card :title="state.team.type" :length="2">
        <div class="flex w-full">
          <img class="absolute w-full h-full object-cover -z-1 opacity-30" :src="`/old/img/${state.team.avatar}`">
          <div class="flex-1 flex">
            <div class="m-auto">
              <p class="font-bold">{{ state.team.name }}</p>
              <p class="text-xs mt-1">{{ state.team.title }}</p>
            </div>
          </div>
        </div>
      </Card>
      <Card title="等级">
        <div class="m-auto text-center">
          <p class="text-2xl">{{ state.team.level }}</p>
        </div>
      </Card>
      <!-- 生命 -->
      <Card title="生命">
        <div class="m-auto text-center">
          <p v-html="state.team.hp"></p>
        </div>
      </Card>
      <!-- 体力 -->
      <Card title="体力">
        <div class="m-auto text-center">
          <p v-html="state.team.mp"></p>
        </div>
      </Card>
      <!-- 怒气 -->
      <Card title="怒气">
        <div class="m-auto text-center">
          <p v-html="state.team.rage"></p>
        </div>
      </Card>
      <!-- 受伤部位 -->
      <Card title="受伤部位" :length="2">
        <div class="flex w-full">
          <div class="flex-1 flex">
            <div class="m-auto">
              <p v-html="state.team.hurt"></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="flex">
      <!-- 基础姿态 -->
      <Card title="基础姿态" :length="2">
        <div class="m-auto text-center">
          <p v-html="state.team.tactic"></p>
        </div>
      </Card>
      <!-- 应战策略 -->
      <Card title="应战策略" :length="2">
        <div class="m-auto text-center">
          <p v-html="state.team.pose"></p>
        </div>
      </Card>
      <!-- 武器 -->
      <Card :length="4" :title="state.team.weaponType">
        <div class="flex w-full p-1 items-center text-sm">
          <div class="flex flex-col flex-1 h-full justify-between">
            <div class="ml-0.5">
              <p v-html="state.team.weapon"></p>
            </div>
            <p class="space-x-1 mb-0.5 text-xs">
              <span class="bg-surfaceContainerHighest rounded px-1.5 py-0.5">品质 {{ state.team.attack }}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
  <!-- 喊话 -->
  <p class="m-1">留言：</p>
  <input v-model="message" class="p-1 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-center" type="text">
  <p class="m-1">转让道具</p>
  <div class="flex justify-center flex-wrap mb-1">
    <p
      v-for="(item, key) in state?.bag"
      @click="chooseItem(item?.name || '', key)"
      :class="chooseItemKey == key && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span v-html="item?.name"></span>
    </p>
  </div>
  <div class="mt-1">
    <p>现在想要做什么？</p>
  </div>
</template>