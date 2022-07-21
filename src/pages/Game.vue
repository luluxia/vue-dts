<script lang="ts" setup>
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Hover from '../components/Hover.vue'
import { provide, reactive } from 'vue'
import type { GameState } from '../types/interface'
// interface State {
//   showHover: boolean
//   hoverType: 'find-item' | 'find-enemy' | 'map'
//   hoverHeight: number
// }
const state: GameState = reactive({
  showHover: false,
  hoverType: 'find-item',
  hoverHeight: 0,
})
provide('state', state)
</script>
<template>
  <div>
    <!-- 游戏卡片 -->
    <div class="max-w-screen-xl mx-auto" :style="{'margin-bottom': state.hoverHeight + 50 + 'px'}">
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
                <div class="flex w-full">
                  <img class="avatar object-cover" src="/img/m_1.gif" alt="">
                  <div class="flex-1 flex">
                    <div class="m-auto">
                      <p class="font-bold">玩家昵称</p>
                      <p class="text-xs mt-1">男生1号</p>
                    </div>
                  </div>
                </div>
              </Card>
              <!-- 等级 -->
              <Card title="等级">
                <div class="w-full h-1 bg-green-600 absolute bottom-0"></div>
                <div class="m-auto text-center">
                  <p class="text-2xl">1</p>
                  <p class="text-sm opacity-50">5/10</p>
                </div>
              </Card>
              <!-- 生命 -->
              <Card title="生命">
                <div class="w-full h-full bg-green-600 absolute bottom-0"></div>
                <div class="m-auto text-center relative">
                  <p>400</p>
                  <p class="text-sm opacity-50">400</p>
                </div>
                <div class="absolute w-full h-full flex p-2">
                  <img class="opacity-10 m-auto" src="/img/heart.png" alt=""/>
                </div>
              </Card>
              <!-- 体力 -->
              <Card title="体力">
                <div class="w-full h-full bg-blue-500 absolute bottom-0"></div>
                <div class="m-auto text-center relative">
                  <p>400</p>
                  <p class="text-sm opacity-50">400</p>
                </div>
                <div class="absolute w-full h-full flex p-3">
                  <img class="opacity-10 m-auto" src="/img/thunder.png" alt=""/>
                </div>
              </Card>
              <!-- 怒气 -->
              <Card title="怒气">
                <div class="m-auto">
                  <p class="text-2xl">0</p>
                </div>
              </Card>
              <!-- 内定称号 -->
              <Card title="内定称号" :length="2">
                <div class="m-auto">
                  <p class="text-xl">内定称号</p>
                </div>
              </Card>
              <!-- 基础姿态 -->
              <Card title="基础姿态" :length="2">
                <div class="m-auto">
                  <p class="text-xl">基础姿态</p>
                </div>
              </Card>
              <!-- 应战策略 -->
              <Card title="应战策略" :length="2">
                <div class="m-auto">
                  <p class="text-xl">应战策略</p>
                </div>
              </Card>
              <!-- 攻击力 -->
              <Card title="攻击力">
                <div class="m-auto text-center">
                  <p class="text-xl">100</p>
                  <p class="text-sm opacity-50">+50</p>
                </div>
              </Card>
              <!-- 防御力 -->
              <Card title="防御力">
                <div class="m-auto text-center">
                  <p class="text-xl">100</p>
                  <p class="text-sm opacity-50">+50</p>
                </div>
              </Card>
              <!-- 队伍 -->
              <Card title="队伍" :length="2">
                <div class="m-auto">
                  <p class="text-xl">队伍</p>
                </div>
              </Card>
              <!-- 殴熟 -->
              <Card title="殴熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
              <!-- 斩熟 -->
              <Card title="斩熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
              <!-- 射熟 -->
              <Card title="射熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
              <!-- 投熟 -->
              <Card title="投熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
              <!-- 爆熟 -->
              <Card title="爆熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
              <!-- 灵熟 -->
              <Card title="灵熟">
                <div class="m-auto">
                  <p class="text-xl">0</p>
                </div>
              </Card>
            </div>
          </div>
          <!-- 位置 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              位置<span class="text-base -ml-1 opacity-10">PLACE</span>
            </h1>
            <!-- 位置 内容 -->
            <div class="flex flex-wrap max-w-152">
              <!-- 当前地区 -->
              <Card title="当前地区" :length="2">
                <div class="m-auto">
                  <p class="text-xl">当前地区</p>
                </div>
              </Card>
              <!-- 天气 -->
              <Card title="天气" :length="2">
                <div class="m-auto">
                  <p class="text-xl">多云</p>
                </div>
              </Card>
              <!-- 时间 -->
              <Card title="时间" :length="4">
                <div class="m-auto">
                  <p class="text-xl">时间</p>
                </div>
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
                  <div class="w-16 h-16 bg-zinc-900/50 rounded mr-2">
                    <img src="img/weapon1.png" alt=""/>
                  </div>
                  <div class="flex flex-col flex-1">
                    <p>装备名称装备名称</p>
                    <p class="text-zinc-400 text-sm">装备效果</p>
                    <p class="text-zinc-400 text-sm">品质 123 耐久 666</p>
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
            </div>
          </div>
          <!-- 行动记录 -->
          <div class="relative">
            <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
              行动记录<span class="text-base -ml-1 opacity-10">LOG</span>
            </h1>
            <!-- 负面效果 内容 -->
            <div class="flex flex-wrap max-w-152 text-zinc-200 p-1">
              <p><span class="text-zinc-500">[20:30] </span>你来到了一片平原。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 游戏行动 -->
    <Hover/>
    <Action/>
  </div>
</template>

<style>
:root {
  scrollbar-gutter: stable;
}
.avatar {
  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
}
.corner {
  position: absolute;
}
.corner::after, .corner::before {
  position: absolute;
  content: '';
  display: block;
  background: #71717A;
}
.corner::after {
  width: 2px;
  height: 15px;
}
.corner::before {
  width: 15px;
  height: 2px;
}
.corner-rt {
  right: 0;
  transform: rotate(90deg);
}
.corner-lb {
  bottom: 0;
  transform: rotate(270deg);
}
.corner-rb {
  bottom: 0;
  right: 0;
  transform: rotate(180deg);
}
</style>