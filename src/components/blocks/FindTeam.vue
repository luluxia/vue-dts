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
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
    发现队友
  </h1>
  <div class="text-zinc-400 mb-2">
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
        <div class="flex w-full p-2 items-center">
          <div class="flex flex-col flex-1 h-full justify-between">
            <div class="ml-0.5">
              <p v-html="state.team.weapon" class="font-bold text-sm"></p>
            </div>
            <p class="text-sm space-x-1 mt-1">
              <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 {{ state.team.attack }}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
  <!-- 喊话 -->
  <p class="text-zinc-400 m-2">留言：</p>
  <input v-model="message" class="p-1 bg-zinc-700 text-zinc-300 rounded text-center" type="text">
  <p class="text-zinc-400 m-2">转让道具</p>
  <div class="text-zinc-300 flex justify-center flex-wrap mb-2">
    <p
      v-for="(item, key) in state?.bag"
      @click="chooseItem(item?.name || '', key)"
      :class="chooseItemKey == key && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ item?.name }}</span>
    </p>
  </div>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>