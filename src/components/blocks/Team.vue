<script setup lang="ts">
import { ref, inject, onMounted, reactive, nextTick } from 'vue'
import tippy, { hideAll } from 'tippy.js'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const avatar = ref()
const avatarList = ref()
onMounted(() => {
  if (gameState.playerState?.team === '') {
    actionState.action = [
      { name: '组建队伍', action: () => create() },
      { name: '返回', action: () => back() },
    ]
    tippy(avatar.value, {
      content: avatarList.value,
      trigger: 'click',
      interactive: true,
      allowHTML: true,
      arrow: false,
      appendTo: document.body,
    })
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
    nextTick(() => {
      tippy(avatar.value, {
        content: avatarList.value,
        trigger: 'click',
        interactive: true,
        allowHTML: true,
        arrow: false,
        appendTo: document.body,
      })
    })
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
    if (gameState.playerState?.team !== '') {
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
    if (gameState.playerState?.team !== '') {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">队伍</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog">
  </div>
  <p>你想要做什么？</p>
  <template v-if="gameState.playerState?.team === ''">
    <div class="flex justify-center flex-wrap mt-1">
      <p
        @click="changeType('create')"
        :class="teamState.type === 'create' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
      >
        <span tooltip="消耗200点体力，组建一只队伍">组建队伍</span>
      </p>
      <p
        @click="changeType('join')"
        :class="teamState.type === 'join' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
      >
        <span tooltip="消耗100点体力，加入一只队伍">加入队伍</span>
      </p>
    </div>
    <div class="text-center">
      <template v-if="teamState.type === 'create'">
        <p class="m-1">队伍头像</p>
        <div class="flex justify-center items-center">
          <div
            ref="avatarList"
            class="
              flex justify-start items-start
              flex-wrap w-135.5 p-1
            "
          >
            <img
              @click="teamState.chooseAvatar = i - 1; hideAll()"
              v-for="i in 13"
              class="h-22 rounded-sm m-0.5 cursor-pointer transition ring-outline hover:ring-2"
              :src="`/old/img/t_${i - 1}.gif`"
            >
          </div>
          <img
            ref="avatar"
            class="h-22 border-2 rounded m-auto cursor-pointer border-outlineVariant transition hover:border-outline"
            :src="`/old/img/t_${teamState.chooseAvatar}.gif`" alt=""
          >
        </div>
      </template>
      <div class="m-1 text-center">
        <p class="m-1">队伍名称</p>
        <input v-model="teamState.teamName" placeholder="15个字以内" class="p-1 bg-surfaceContainerHighest rounded text-center" type="text">
      </div>
      <div class="m-1 text-center">
        <p class="m-1">队伍密码</p>
        <input v-model="teamState.teamPassword" placeholder="15个字以内" class="p-1 bg-surfaceContainerHighest rounded text-center" type="text">
      </div>
    </div>
  </template>
</template>