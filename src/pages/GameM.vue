<script lang="ts" setup>
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
import { onMounted, provide, reactive } from 'vue'
import type { GameState, ActionState } from '../types/interface'
import axios from 'axios'
const state = reactive<GameState>({ drawerType: '' })
provide('state', state)

const actionState: ActionState = reactive({
  action: [],
  oldType: '',
  showDetail: false,
  width: 0,
  height: 0,
  firstCheck: true,
})
provide('actionState', actionState)

onMounted(async () => {
  await axios.get('game.php')
    .then(res => {
      const data = res.data as any
      if (data.playerState) {
        state.playerState = data.playerState
        state.searchState = data.searchState
        state.actionLog = data.actionLog
        state.log = data.log
      }
      console.log(res)
    })
})
</script>
<template>
  <!-- <p class="<sm:(w-[calc(25%-0.125rem)]) <sm:(w-[calc(50%-0.125rem)]) <sm:(w-[calc(75%-0.125rem)]) <sm:(w-[calc(100%-0.125rem)]) hidden"></p> -->
  <div class="mt-16">
    <div class="text-zinc-400 bg-zinc-800 px-4 py-2 -mt-1 sticky top-0 flex space-x-4">
      <p class="font-bold text-zinc-300">状态</p>
      <p>地点</p>
      <p>负面效果</p>
      <p>装备</p>
      <p>包裹</p>
    </div>
    <div class="flex flex-wrap w-full m-auto px-2 pt-2">
      <Card title="参展者" :length="3"></Card>
      <Card title="等级"></Card>
      <Card title="生命"></Card>
      <Card title="体力"></Card>
      <Card title="怒气"></Card>
      <Card title="歌魂"></Card>
    </div>
    <Drawer/>
    <Action/>
  </div>
</template>