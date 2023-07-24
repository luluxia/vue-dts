<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.playerState) {
    let traps: any[] = []
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      if (gameState.playerState?.bag[key] && gameState.playerState?.bag[key]?.type.includes('陷阱')) {
        traps.push({
          key,
          item: gameState.playerState?.bag[key],
        })
      }
    })
    return {
      traps,
      weapon: gameState.playerState.equipment.weapon,
      gift: gameState.playerState.gift.nowGiftId
    }
  }
})
const electricState = reactive({
  selectWeapon: false,
  selectTrapKey: '',
})
const selectWeapon = (item: any) => {
  electricState.selectWeapon = true
  electricState.selectTrapKey = ''
  actionState.action = [
    { name: '改造 ' + item.name, action: () => changeWeapon() },
    { name: '返回', action: () => back() },
  ]
}
const selectTrap = (item: any) => {
  electricState.selectTrapKey = item.key
  electricState.selectWeapon = false
  actionState.action = [
    { name: '改造 ' + item.item.name, action: () => changeTrap() },
    { name: '返回', action: () => back() },
  ]
}
onMounted(() => {
  actionState.action = [
    { name: '返回', action: () => back() },
  ]
})
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'menu' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const changeWeapon = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'command',
    command: 'special',
    sp_cmd: 'sp_adtsk'
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const changeTrap = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'command',
    command: 'special',
    sp_cmd: 'sp_trapadtskselected',
    choice: electricState.selectTrapKey.replace('item', ''),
  }).then(res => {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">
    {{ state?.gift == '7' ? '带电' : '淬毒' }}
  </h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog">

  </div>
  <div class="text-zinc-400 mb-2">
    <p>
      {{ state?.gift == '7' ? '消耗一枚电池，为武器或陷阱附加电击属性。' : '消耗一份毒药，为武器或陷阱附加带毒属性' }}
    </p>
  </div>
  <!-- 武器带电 -->
  <p class="text-zinc-300 font-bold">改造武器</p>
  <div class="text-zinc-300 flex justify-center flex-wrap my-2">
    <p
      v-if="state?.weapon.name && state.weapon.name !== '拳头'"
      @click="selectWeapon(state?.weapon)"
      :class="electricState.selectWeapon && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ state?.weapon.name }}</span>
    </p>
    <p class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 opacity-50" v-else>
      当前未装备武器
    </p>
  </div>
  <!-- 陷阱带电 -->
  <p class="text-zinc-300 font-bold">改造陷阱</p>
  <div class="text-zinc-300 flex justify-center flex-wrap my-2">
    <p
      v-for="item in state?.traps"
      @click="selectTrap(item)"
      :class="electricState.selectTrapKey === item.key && 'ring-2 ring-zinc-500'"
      class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
    >
      <span>{{ item.item.name }}</span>
    </p>
    <p class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 opacity-50" v-if="!state?.traps.length">
      包裹中没有陷阱
    </p>
  </div>
</template>