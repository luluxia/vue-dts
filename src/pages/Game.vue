<script lang="ts" setup>
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
import Sidebar from '../components/Sidebar.vue'
import Loading from '../components/Loading.vue'

import Player from '../components/cards/Player.vue'
import Level from '../components/cards/Level.vue'
import Hp from '../components/cards/Hp.vue'
import Mp from '../components/cards/Mp.vue'
import Rage from '../components/cards/Rage.vue'
import SongSoul from '../components/cards/SongSoul.vue'
import Gift from '../components/cards/Gift.vue'
import Tactic from '../components/cards/Tactic.vue'
import Pose from '../components/cards/Pose.vue'
import Attack from '../components/cards/Attack.vue'
import Defense from '../components/cards/Defense.vue'
import Team from '../components/cards/Team.vue'
import Proficiency from '../components/cards/Proficiency.vue'

import NowArea from '../components/cards/NowArea.vue'
import Remain from '../components/cards/Remain.vue'
import Passage from '../components/cards/Passage.vue'
import Weather from '../components/cards/Weather.vue'

import Debuffs from '../components/cards/Debuffs.vue'

import Item from '../components/cards/Item.vue'

import Log from '../components/Log.vue'

import Equipment from '../components/Equipment.vue'
import Package from '../components/Package.vue'

import { onMounted, provide, reactive } from 'vue'
import type { GameState, ActionState } from '../types/interface'
import { command } from '../utils/api'
import axios from 'axios'
const initState: GameState = {
  showDrawer: false,
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
  <div>
    <div class="fixed w-screen h-screen top-0">
      <img v-if="state.playerState?.area.nowArea" class="w-full h-full object-cover opacity-10 grayscale" :src="`/old/img/location/${state.playerState?.area.nowArea}.jpg`" alt="">
      <img v-else src="/img/bg.png"/>
    </div>
    <Transition><Loading/></Transition>
    <!-- 游戏卡片 -->
    <div class="max-w-screen-xl mx-auto pt-2" :style="{'margin-bottom': (state.drawerHeight || 100) + 20 + 'px'}">
      <p class="w-19 w-38.5 w-58 w-77.5 hidden"></p>
      <div class="flex justify-between">
        <!-- 左侧 -->
        <div class="space-y-1">
          <!-- 状态 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
              状态<span class="text-base -ml-1 opacity-10">STATUS</span>
            </h1>
            <!-- 状态 内容 -->
            <div class="flex flex-wrap max-w-156">
              <!-- 头像 -->
              <Card :title="state.playerState?.playerInfo.nick" :length="3">
                <Player/>
              </Card>
              <!-- 等级 -->
              <Card class="overflow-hidden" title="等级">
                <Level/>
              </Card>
              <!-- 生命 -->
              <Card class="overflow-hidden" title="生命">
                <Hp/>
              </Card>
              <!-- 体力 -->
              <Card class="overflow-hidden" title="体力">
                <Mp/>
              </Card>
              <!-- 怒气 -->
              <Card title="怒气">
                <Rage/>
              </Card>
              <!-- 歌魂 -->
              <Card title="歌魂">
                <SongSoul/>
              </Card>
              <!-- 内定称号 -->
              <Card title="内定称号" :length="2">
                <Gift/>
              </Card>
              <!-- 基础姿态 -->
              <Card title="基础姿态" :length="2">
                <Pose/>
              </Card>
              <!-- 应战策略 -->
              <Card title="应战策略" :length="2">
                <Tactic/>
              </Card>
              <!-- 攻击力 -->
              <Card title="攻击力">
                <Attack/>
              </Card>
              <!-- 防御力 -->
              <Card title="防御力">
                <Defense/>
              </Card>
              <!-- 队伍 -->
              <Card title="队伍" :length="2">
                <Team/>
              </Card>
              <!-- 殴熟 -->
              <Card title="殴熟">
                <Proficiency type="melee"/>
              </Card>
              <!-- 斩熟 -->
              <Card title="斩熟">
                <Proficiency type="slash"/>
              </Card>
              <!-- 射熟 -->
              <Card title="射熟">
                <Proficiency type="shoot"/>
              </Card>
              <!-- 投熟 -->
              <Card title="投熟">
                <Proficiency type="throw"/>
              </Card>
              <!-- 爆熟 -->
              <Card title="爆熟">
                <Proficiency type="blast"/>
              </Card>
              <!-- 灵熟 -->
              <Card title="灵熟">
                <Proficiency type="spirit"/>
              </Card>
            </div>
          </div>
          <!-- 位置 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
              地点<span class="text-base -ml-1 opacity-10">AREA</span>
            </h1>
            <!-- 位置 内容 -->
            <div class="flex flex-wrap max-w-156">
              <!-- 当前地点 -->
              <Card title="当前地点" :length="2">
                <NowArea/>
              </Card>
              <!-- 通行状态 -->
              <Card title="通行状态" :length="2">
                <Passage/>
              </Card>
              <!-- 剩余人数 -->
              <Card title="剩余人数" :length="2">
                <Remain/>
              </Card>
              <!-- 天气 -->
              <Card title="天气" :length="2">
                <Weather/>
              </Card>
            </div>
          </div>
          <!-- 负面效果 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
              负面效果<span class="text-base -ml-1 opacity-10">DEBUFF</span>
            </h1>
            <!-- 负面效果 内容 -->
            <div class="flex flex-wrap max-w-156">
              <!-- 负面效果 -->
              <Debuffs/>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="space-y-1">
          <!-- 装备 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
              装备<span class="text-base -ml-1 opacity-10">EQUIPMENT</span>
            </h1>
            <!-- 装备 内容 -->
            <div v-if="state.playerState" class="flex flex-wrap max-w-156">
              <Equipment/>
            </div>
          </div>
          <!-- 包裹 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
              包裹<span class="text-base -ml-1 opacity-10">PACKAGE</span>
            </h1>
            <!-- 包裹 内容 -->
            <div v-if="state.playerState" class="flex flex-wrap max-w-156">
              <Package/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <Sidebar/>
    <!-- 游戏行动 -->
    <Drawer/>
    <Action/>
  </div>
</template>

<style lang="postcss">
:root {
  scrollbar-gutter: stable;
}
*::-webkit-scrollbar {
  width: 10px;
  /* background-color: hsla(0,0%,100%,.025); */
  /* border-radius: 100px; */
}
*::-webkit-scrollbar-thumb {
  background: hsla(0,0%,100%,.5);
  /* border-radius: 100px; */
  background-clip: padding-box;
  border: 2px solid hsla(0,0%,100%,0);
  border-top: none;
  border-bottom: none;
  min-height: 10px;
}
.avatar {
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

span[tooltip] {
  @apply relative flex justify-center items-center w-max;
}
span[tooltip]::after {
  content: '[?]';
  @apply text-sm opacity-50 ml-0.5;
}
span[tooltip]::before {
  content: attr(tooltip);
  @apply bg-zinc-800/95 text-sm font-normal text-left p-2 absolute bottom-8 w-max max-w-70 border-2 text-zinc-200 border-zinc-600 z-2 whitespace-pre-line shadow opacity-0 pointer-events-none transition transition-opacity;
}
span[tooltip]:hover::before {
  opacity: 1;
}
.tooltip-down span[tooltip]::before {
  @apply top-8 bottom-auto;
}
.rainbow {
	text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
	animation: rainbowshimmer 2s ease-in-out infinite;
}
@keyframes rainbowshimmer {
	0% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
	}
	20% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00, 0 0 60px #00ff00, 0 0 70px #00ff00;
	}
	40% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ffff00, 0 0 40px #ffff00, 0 0 50px #ffff00, 0 0 60px #ffff00, 0 0 70px #ffff00;
	}
	60% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0000ff, 0 0 40px #0000ff, 0 0 50px #0000ff, 0 0 60px #0000ff, 0 0 70px #0000ff;
	}
	80% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff, 0 0 60px #ff00ff, 0 0 70px #ff00ff;
	}
	100% {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
	}
}
.b {
  border: none;
}
</style>