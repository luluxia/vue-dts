<script lang="ts" setup>
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
import { onMounted, provide, reactive } from 'vue'
import type { GameState, ActionState } from '../types/interface'
import axios from 'axios'
const initState: GameState = {
  hideDrawer: false,
  drawerType: '',
  drawerHeight: 0,
  loading: false,
  playerState: {
    playerInfo: {
      nick: '',
      name: '',
      sex: '',
      id: 0,
      avatar: '',
    },
    level: {
      nowLevel: 0,
      exp: 0,
      upgradeExp: 0,
    },
    hp: {
      nowHp: 0,
      maxHp: 0,
    },
    mp: {
      nowMp: 0,
      maxMp: 0,
    },
    rage: 0,
    songSoul: {
      nowSongSoul: 0,
      maxSongSoul: 0,
    },
    gift: {
      nowGiftId: '',
      giftList: [],
      type: {},
    },
    tactic: {
      nowTacticId: '',
      nowTactic: '',
      idList: [],
      type: [],
      tips: [],
    },
    pose: {
      nowPoseId: '',
      nowPose: '',
      idList: [],
      type: [],
      tips: [],
    },
    attack: 0,
    defense: 0,
    team: '',
    proficiency: {
      melee: 0,
      slash: 0,
      shoot: 0,
      throw: 0,
      blast: 0,
      spirit: 0,
    },
    debuff: [''],
    equipment: {
      weapon: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      },
      armor: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      },
      arm: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      },
      helmet: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      },
      boot: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      },
      accessory: {
        type: '',
        name: '',
        props: '',
        quality: 0,
        durability: '0'
      }
    },
    bag: {
      item1: null,
      item2: null,
      item3: null,
      item4: null,
      item5: null,
      item6: null,
    },
    itemBag: {
      item: null,
      num: 0,
      limit: 0,
      isEquip: false,
    },
    money: 0,
    area: {
      nowArea: 0,
      aliveNum: 0,
      weather: 0,
      areaList: [],
      areaNum: 0,
      areaAdd: 0,
    },
    attackType: {
      type1: {
        id: '',
        name: '',
      },
      type2: {
        id: '',
        name: '',
      },
    },
    semo: {},
    craftTips: '',
    craftDialog: '',
    rest: '',
    skill: [],
    skillPoint: 0,
    shop: [],
    canAction: [],
    depotItems: [],
    rp: null,
    mercenary: {
      moveList: [],
      mercList: [],
    },
  },
  log: []
}
const state = reactive(initState)
provide('state', state)

const actionState: ActionState = reactive({
  action: [],
  oldAction: [{ name: '', action: () => {} }],
  oldType: '',
  showDetail: false,
  width: 0,
  height: 0,
  firstCheck: true,
})
provide('actionState', actionState)

onMounted(async () => {
  await axios.get('/old/game.php')
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