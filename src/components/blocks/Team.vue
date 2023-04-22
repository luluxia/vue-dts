<script setup lang="ts">
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
onMounted(() => {
  if (gameState.playerState?.team === '无') {
    actionState.action = [
      { name: '组建队伍', action: () => create() },
      { name: '返回', action: () => back() },
    ]
  } else {
    actionState.action = [
      { name: '脱离队伍', action: () => quit() },
      { name: '返回', action: () => back() },
    ]
  }
})
const teamState = reactive({
  type: 'create',
  showAvatar: false,
  chooseAvatar: 0,
  teamName: '',
  teamPassword: '',
})
const changeType = (type: string) => {
  teamState.type = type
  if (type === 'create') {
    actionState.action = [
      { name: '组建队伍', action: () => create() },
      { name: '返回', action: () => back() },
    ]
  } else {
    actionState.action = [
      { name: '加入队伍', action: () => join() },
      { name: '返回', action: () => back() },
    ]
  }
}
const create = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'team',
    command: 'teammake',
    ticon: teamState.chooseAvatar,
    nteamID: teamState.teamName,
    nteamPass: teamState.teamPassword
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    if (gameState.playerState?.team !== '无') {
      gameState.drawerType = ''
    }
  })
}
const join = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'team',
    command: 'teamjoin',
    nteamID: teamState.teamName,
    nteamPass: teamState.teamPassword
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    if (gameState.playerState?.team !== '无') {
      gameState.drawerType = ''
    }
  })
}
const quit = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'command', command: 'team', teamcmd: 'teamquit'}).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const back = () => {
  gameState.drawerType = ''
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">队伍</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog">
  </div>
  <p class="text-zinc-400">你想要做什么？</p>
  <template v-if="gameState.playerState?.team === '无'">
    <div class="text-zinc-300 flex justify-center flex-wrap mt-2">
      <p
        @click="changeType('create')"
        :class="teamState.type === 'create' && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span tooltip="消耗200点体力，组建一只队伍">组建队伍</span>
      </p>
      <p
        @click="changeType('join')"
        :class="teamState.type === 'join' && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700 px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span tooltip="消耗100点体力，加入一只队伍">加入队伍</span>
      </p>
    </div>
    <div class="text-center">
      <template v-if="teamState.type === 'create'">
        <p class="text-zinc-400 m-2">队伍头像</p>
        <div class="flex justify-center items-center">
          <div
            class="
              absolute flex justify-start items-start
              flex-wrap w-136.5 bg-zinc-800 p-1 border-2
              border-zinc-500 rounded transition opacity-0 pointer-events-none"
            :class="teamState.showAvatar && 'opacity-100 pointer-events-auto'"
          >
            <img
              @click="teamState.showAvatar = false; teamState.chooseAvatar = i - 1"
              v-for="i in 13"
              class="h-22 rounded m-0.5 cursor-pointer transition ring-zinc-400 hover:ring-2"
              :src="`/old/img/t_${i - 1}.gif`"
            >
          </div>
          <img
            @click="teamState.showAvatar = true"
            class="h-22 border-2 rounded m-auto cursor-pointer border-zinc-500/50 transition hover:border-zinc-500"
            :src="`/old/img/t_${teamState.chooseAvatar}.gif`" alt=""
          >
        </div>
      </template>
      <div class="m-2 text-center">
        <p class="text-zinc-400 m-2">队伍名称</p>
        <input v-model="teamState.teamName" placeholder="15个字以内" class="p-1 bg-zinc-700 text-zinc-300 rounded text-center" type="text">
      </div>
      <div class="m-2 text-center">
        <p class="text-zinc-400 m-2">队伍密码</p>
        <input v-model="teamState.teamPassword" placeholder="15个字以内" class="p-1 bg-zinc-700 text-zinc-300 rounded text-center" type="text">
      </div>
    </div>
  </template>
</template>