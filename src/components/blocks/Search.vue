<!-- 数据检索 -->
<script setup lang="ts">
import { computed, nextTick, reactive, inject, ref, onMounted } from 'vue'
import tippy, { hideAll } from 'tippy.js'
import { command } from '../../utils/api'
import { itemData, playerType } from '../../utils/data'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
actionState.action = [
  { name: '查找', action: () => search(), active: false },
  { name: '返回', action: () => { gameState.drawerType = 'control-panel' } },
]
const searchState = reactive({
  type: 'player',
  playerType: '0',
  input: '',
  showList: false,
})
const changeType = (type: string) => {
  searchState.type = type
}
const searchList = computed(() => {
  if (searchState.input) {
    return Object.keys(itemData).filter(i => itemData[i].includes(searchState.input))
  }
})
const chooseItem = (id: string) => {
  searchState.input = itemData[id]
  nextTick(() => {
    searchState.showList = false
  })
}
const checkInput = () => {
  searchState.showList = true
  if (searchState.input) {
    actionState.action[0].active = true
  } else {
    actionState.action[0].active = false
  }
}
const playerTypeBtn = ref()
const playerTypeList = ref()
onMounted(() => {
  tippy(playerTypeBtn.value, {
    content: playerTypeList.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom',
    appendTo: () => document.body,
  })
})
const search = async () => {
  let commandSend = { mode: 'command', command: 'consle_search', csc: '', cstype: 0, csnm: searchState.input }
  if (searchState.type === 'player') {
    commandSend.csc = 'csearch2'
  } else if (searchState.type === 'item') {
    commandSend.csc = 'csearch0'
  } else if (searchState.type === 'trap') {
    commandSend.csc = 'csearch1'
  }
  commandSend.cstype = Number(searchState.playerType)
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command(commandSend).then(res => {
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
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">数据检索</h1>
  <div>
    <p>提交指令后，你眼前的数据流开始闪烁……</p>
    <p>片刻后，你的战术界面上显现出了几行额外的选项。</p>
    <p>你打算怎么做呢？</p>
  </div>
  <div class="flex justify-center flex-wrap mt-1">
    <p
      @click="changeType('player')"
      :class="searchState.type === 'player' && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span>查找角色/NPC位置</span>
    </p>
    <p
      @click="changeType('item')"
      :class="searchState.type === 'item' && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span>查找物品数量及位置</span>
    </p>
    <p
      @click="changeType('trap')"
      :class="searchState.type === 'trap' && 'ring-2 ring-outline'"
      class="bg-surfaceContainer px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
    >
      <span>查找陷阱数量及位置</span>
    </p>
  </div>
  <div class="my-1">
    <p>※ 请在此输入查找对象的完整名称（不支持关键字搜索）</p>
  </div>
  <div class="relative flex justify-center">
    <div :class="searchState.type !== 'player' && 'hidden'">
      <p ref="playerTypeBtn" class="px-2.5 py-1 mr-1 bg-surfaceContainer rounded text-center cursor-pointer">
        {{ playerType[searchState.playerType] }}
      </p>
      <div ref="playerTypeList" class="max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain text-center">
        <p @click="searchState.playerType = id; hideAll()" v-for="id in Object.keys(playerType)" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)">
          {{ playerType[id] }}
        </p>
      </div>
    </div>
    <input v-model="searchState.input" @input="checkInput()" class="p-1 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-center w-max" type="text">
    <Teleport to="body">
      <div class="absolute w-full text-sm bottom-30">
        <div v-if="searchState.showList && searchList?.length" class="mx-auto w-max rounded border-2 border-outline bg-surfaceContainer">
          <div class="box-scrollbar max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain text-onSurface text-center">
            <p v-for="id in searchList" @click="chooseItem(id)" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)">
              {{ itemData[id] }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>