<script lang="ts" setup>
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
import Loading from '../components/Loading.vue'

import Player from '../components/cards/Player.vue'
import Level from '../components/cards/Level.vue'
import Hp from '../components/cards/Hp.vue'
import Mp from '../components/cards/Mp.vue'
import Rage from '../components/cards/Rage.vue'
import Gift from '../components/cards/Gift.vue'
import Tactic from '../components/cards/Tactic.vue'
import Pose from '../components/cards/Pose.vue'
import Attack from '../components/cards/Attack.vue'
import Defense from '../components/cards/Defense.vue'
import Team from '../components/cards/Team.vue'
import Proficiency from '../components/cards/Proficiency.vue'

import NowArea from '../components/cards/NowArea.vue'
import Weather from '../components/cards/Weather.vue'
import Time from '../components/cards/Time.vue'

import { provide, reactive } from 'vue'
import type { GameState } from '../types/interface'
const initState: GameState = {
  showDrawer: false,
  drawerType: 'find-item',
  drawerHeight: 0,
  loading: false,
  playerState: {
    playerInfo: {
      name: '玩家姓名',
      sex: '男',
      id: 1,
    },
    level: {
      nowLevel: 1,
      exp: 8,
      upgradeExp: 10,
    },
    hp: {
      nowHp: 100,
      maxHp: 150,
    },
    mp: {
      nowMp: 200,
      maxMp: 400,
    },
    rage: 0,
    gift: '内定称呼',
    tactic: '基础姿态',
    pose: '应战策略',
    attack: 100,
    defense: 100,
    team: '队伍',
    proficiency: {
      melee: 1,
      slash: 2,
      shoot: 3,
      throw: 4,
      blast: 5,
      spirit: 6,
    },
    debuff: ['负面状态']
  },
  areaState: {
    nowArea: '当前区域',
    remain: 5,
    weather: '多云'
  }
}
const state = reactive(initState)
provide('state', state)
</script>

<template>
  <div>
    <Transition><Loading/></Transition>
    <!-- 游戏卡片 -->
    <div class="max-w-screen-xl mx-auto" :style="{'margin-bottom': (state.drawerHeight || 100) + 50 + 'px'}">
      <p class="w-18 w-37 w-75 hidden"></p>
      <div class="flex justify-between">
        <!-- 左侧 -->
        <div class="space-y-4">
          <!-- 状态 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              状态<span class="text-base -ml-1 opacity-10">STATUS</span>
            </h1>
            <!-- 状态 内容 -->
            <div class="flex flex-wrap max-w-152">
              <!-- 头像 -->
              <Card title="参展者" :length="4">
                <Player/>
              </Card>
              <!-- 等级 -->
              <Card title="等级">
                <Level/>
              </Card>
              <!-- 生命 -->
              <Card title="生命">
                <Hp/>
              </Card>
              <!-- 体力 -->
              <Card title="体力">
                <Mp/>
              </Card>
              <!-- 怒气 -->
              <Card title="怒气">
                <Rage/>
              </Card>
              <!-- 内定称号 -->
              <Card title="内定称号" :length="2">
                <Gift/>
              </Card>
              <!-- 基础姿态 -->
              <Card title="基础姿态" :length="2">
                <Tactic/>
              </Card>
              <!-- 应战策略 -->
              <Card title="应战策略" :length="2">
                <Pose/>
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
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              地点<span class="text-base -ml-1 opacity-10">AREA</span>
            </h1>
            <!-- 位置 内容 -->
            <div class="flex flex-wrap max-w-152">
              <!-- 当前地点 -->
              <Card title="当前地点" :length="2">
                <NowArea/>
              </Card>
              <!-- 天气 -->
              <Card title="天气" :length="2">
                <Weather/>
              </Card>
              <!-- 时间 -->
              <Card title="时间" :length="4">
                <Time/>
              </Card>
            </div>
          </div>
          <!-- 负面效果 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              负面效果<span class="text-base -ml-1 opacity-10">DEBUFF</span>
            </h1>
            <!-- 负面效果 内容 -->
            <div class="flex flex-wrap max-w-152">
              <!-- 负面效果 -->
              <Card title="负面效果" :length="2">
                <div class="m-auto">
                  <p class="text-xl">负面效果</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="space-y-4">
          <!-- 装备 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              装备<span class="text-base -ml-1 opacity-10">EQUIPMENT</span>
            </h1>
            <!-- 负面效果 内容 -->
            <div class="flex flex-wrap max-w-152">
              <!-- 装备 -->
              <Card title="装备" :length="4" class="group transition hover:(ring-zinc-500 ring-2)">
                <div class="flex w-full p-2 items-center">
                  <div class="w-16 h-16 rounded bg-zinc-900/50 mr-2">
                    <img src="img/weapon1.png" alt=""/>
                  </div>
                  <div class="flex flex-col flex-1">
                    <div class="ml-0.5">
                      <p class="font-bold text-sm">最终战术『心火』</p>
                      <p class="text-zinc-400 text-sm">菁英 连击 重击辅助 爆炸</p>
                    </div>
                    <p class="text-sm space-x-1 mt-1">
                      <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 99999</span>
                      <span class="text-green-400 bg-zinc-900/50 rounded px-1.5 py-0.5">耐久 20</span>
                    </p>
                  </div>
                </div>
                <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
                  <p class="m-auto text-xs px-3 py-1 bg-zinc-600 rounded">卸下</p>
                  <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
                </div>
              </Card>
              <!-- 装备 -->
              <Card title="装备" :length="4">
                <div class="m-auto">
                  <p class="text-xl">装备</p>
                </div>
              </Card>
              <!-- 装备 -->
              <Card title="装备" :length="4">
                <div class="m-auto">
                  <p class="text-xl">装备</p>
                </div>
              </Card>
              <!-- 装备 -->
              <Card title="装备" :length="4">
                <div class="m-auto">
                  <p class="text-xl">装备</p>
                </div>
              </Card>
              <!-- 装备 -->
              <Card :length="4" class="border-2 border-dashed bg-transparent">
                <div class="m-auto">
                  <p class="text-xl opacity-50">腿部装备</p>
                </div>
              </Card>
              <!-- 装备 -->
              <Card :length="4" class="border-2 border-dashed bg-transparent">
                <div class="m-auto">
                  <p class="text-xl opacity-50">饰品</p>
                </div>
              </Card>
            </div>
          </div>
          <!-- 记录 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              记录<span class="text-base -ml-1 opacity-10">LOG</span>
            </h1>
            <!-- 负面效果 内容 -->
            <div class="max-w-152 h-65 overflow-y-auto text-zinc-200 px-1">
              <div v-for="item in 20" class="flex space-x-1">
                <p class="text-zinc-500">[20:30]</p>
                <p>你来到了一片平原。</p>
              </div>
              <div class="flex space-x-1">
                <p class="text-zinc-500">[20:30]</p>
                <p>AC翻唱职人被参展者 admin埋设最终战术『心火』伏击炸死【各路党派 AC翻唱职人：“我觉得我还可以抢救一下……”】</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 游戏行动 -->
    <Drawer/>
    <Action/>
  </div>
</template>

<style>
:root {
  scrollbar-gutter: stable;
}
*::-webkit-scrollbar {
  width: 10px;
  background-color: hsla(0,0%,100%,.025);
  border-radius: 100px;
}
*::-webkit-scrollbar-thumb {
  background: hsla(0,0%,100%,.5);
  border-radius: 100px;
  background-clip: padding-box;
  border: 2px solid hsla(0,0%,100%,0);
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
</style>