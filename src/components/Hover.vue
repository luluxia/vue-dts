<script lang="ts" setup>
import { inject, watch, ref, nextTick } from 'vue'
import Card from './Card.vue'
import GameData from '../utils/data'
import tippy, { createSingleton } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state', {
  showHover: false,
  hoverType: '',
  hoverHeight: 0,
})
const hoverDom = ref()
const tippyRef = ref()
let tippys = tippy('.tippy-tip', {
  content: '123',
  allowHTML: true,
})
const singleton = createSingleton(tippys, {
  interactive: true,
  arrow: false,
  moveTransition: 'transform 0.2s ease-out',
  animation: 'shift-away-subtle',
})
watch(() => state.showHover, (val) => {
  if (val) {
    nextTick(() => {
      state.hoverHeight = hoverDom.value.getClientRects()[0].height
      console.log(state.hoverHeight)
      tippys.forEach(item => item.destroy())
      tippys = tippy('.tippy-tip', {
        content: () => tippyRef.value.cloneNode(true),
        allowHTML: true,
      })
      console.log(tippys)
      singleton.setInstances(tippys)
    })
  } else {
    state.hoverHeight = 0
  }
})
</script>
<template>
  <div class="hidden">
    <div class="flex" ref="tippyRef">
      <div>
        <p class="p-1 text-center">合成物品</p>
        <Card :length="2" :title="'物品'">
          <div class="p-1.5">
            <p>物品名</p>
          </div>
        </Card>
      </div>
      <div>
        <p class="p-1 text-center">需求材料</p>
        <div class="bg-zinc-700/50 text-zinc-300 p-2 h-28 rounded m-0.5">
          <p>材料1</p>
          <p>材料22</p>
          <p>材料333</p>
          <p>材料4444</p>
          <p>材料55555</p>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fixed bottom-0 w-screen flex bg-zinc-900/90 border-zinc-600/40 pb-2 border-t-2 transition transform duration-300"
    ref="hoverDom"
    :class="state.showHover ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
  >
    <div class="m-auto flex flex-col items-center pb-32">
      <!-- 发现物品 -->
      <template v-if="state.hoverType == 'find-item'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">发现物品</h1>
        <div class="text-zinc-400 text-sm mb-2">
          <p>消耗15点体力，你搜索着周围的一切。</p>
          <p>发现了物品 某某。</p>
        </div>
        <Card :length="4" :title="'爆炸物'" class="group transition hover:(ring-zinc-500 ring-2)">
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
                <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 123</span>
                <span class="text-green-400 bg-zinc-900/50 rounded px-1.5 py-0.5">耐久 666</span>
              </p>
            </div>
          </div>
        </Card>
        <div class="text-zinc-400 text-sm mt-2">
          <p>你想如何处理？</p>
        </div>
      </template>
      <!-- 敌人相关 -->
      <template v-if="['find-enemy', 'attack-enemy', 'attacked-by-enemy'].includes(state.hoverType)">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
          <template v-if="state.hoverType == 'find-enemy'">发现敌人</template>
          <template v-else>发生战斗</template>
        </h1>
        <div v-if="state.hoverType == 'find-enemy'" class="text-zinc-400 text-sm mb-2">
          <p>消耗<span class="text-yellow-600 font-bold">15</span>点体力，移动到了端点。</p>
          <p>你发现了敌人<span class="text-red-600 font-bold">✦覆唱的篝火</span></p>
          <p>对方好像完全没有注意到你！</p>
        </div>
        <div v-if="state.hoverType == 'attack-enemy'" class="text-zinc-400 text-sm mb-2">
          <p>你向<span class="text-red-600 font-bold">✦执念的残火</span>发起了攻击！</p>
          <p>使用乒乓球<span class="text-yellow-600 font-bold">投掷</span>✦执念的残火！</p>
          <p>你的攻击完全被<span class="text-red-600 font-bold">✦执念的残火</span>的装备吸收了！</p>
          <p>造成<span class="text-yellow-600 font-bold">1</span>点伤害！</p>
          <p>你用掉了<span class="text-yellow-600 font-bold">1</span>个乒乓球。</p>
          <p>“ΨХΛТΔЫЩΨΡ ЦΨΜПΨХЩЦ...”</p>
          <p><span class="text-red-600 font-bold">✦执念的残火</span>攻击范围不足，不能反击，逃跑了！</p>
        </div>
        <div class="flex">
          <Card title="种火" :length="4">
            <div class="flex w-full">
              <img class="avatar object-cover" src="/img/n_34.gif" alt="">
              <div class="flex-1 flex">
                <div class="m-auto">
                  <p class="font-bold">✦覆唱的篝火</p>
                  <p class="text-xs mt-1">女生100号</p>
                </div>
              </div>
            </div>
          </Card>
          <Card title="等级">
            <div class="w-full h-1 bg-green-600 absolute bottom-0"></div>
            <div class="m-auto text-center">
              <p class="text-2xl">13</p>
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
        </div>
        <div class="flex">
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
          <Card title="装备" :length="4">
            <div class="m-auto">
              <p class="text-xl">装备</p>
            </div>
          </Card>
        </div>
        <div class="text-zinc-400 text-sm mt-2">
          <p>现在想要做什么？</p>
        </div>
      </template>
      <!-- 地图 -->
      <template v-if="state.hoverType == 'map'">
        <img class="w-200 h-140" src="img/map.png" alt="">
        <div class="fixed w-200 px-10 py-10 text-zinc-200 text-sm text-shadow-sm grid grid-cols-10 grid-rows-10 text-center">
          <p
            class="flex justify-center items-center py-1 cursor-pointer" 
            :class="`row-start-${item.x} col-start-${item.y}`"
            v-for="item in GameData.map"
            v-html="item.name"
          ></p>
        </div>
      </template>
      <!-- 合成 -->
      <template v-if="state.hoverType == 'crafting'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">合成</h1>
        <div class="text-zinc-400 text-sm mb-2">
          <p>当前可以合成的道具</p>
        </div>
        <div class="text-zinc-300 flex w-200 justify-center flex-wrap">
          <p class="tippy-tip bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">松茸御饭</p>
          <p class="tippy-tip bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">火水木金土符『贤者之石』</p>
          <p class="tippy-tip bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">◆◆◆意念数据</p>
        </div>
        <div class="text-zinc-400 text-sm my-2">
          <p>当前缺少部分素材的道具</p>
        </div>
        <div class="text-zinc-300 flex w-200 justify-center flex-wrap">
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">「VW-强击虎」</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">正义盟军 光明守望者 ★8</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">神枪『Spear The Gungnir』</p>
        </div>
      </template>
      <!-- 睡眠/治疗 -->
      <template v-if="['sleep', 'heal'].includes(state.hoverType)">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
          <template v-if="state.hoverType == 'sleep'">睡眠</template>
          <template v-else>治疗</template>
        </h1>
        <div class="text-zinc-400 text-sm mb-2">
          <template v-if="state.hoverType == 'sleep'">睡眠</template>
          <template v-else>治疗</template>
        </div>
      </template>
      <!-- 战术 -->
      <template v-if="state.hoverType == 'tactics'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">战术选择</h1>
        <div class="text-zinc-400 text-sm mb-2">
          <p>基础姿态</p>
        </div>
        <div class="text-zinc-300 flex w-200 justify-center flex-wrap">
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">通常</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">作战姿态</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">探物姿态</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">偷袭姿态</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">治疗姿态</p>
        </div>
        <div class="text-zinc-400 text-sm my-2">
          <p>应战策略</p>
        </div>
        <div class="text-zinc-300 flex w-200 justify-center flex-wrap">
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">通常</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">重视反击</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">重视防御</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">重视躲避</p>
        </div>
      </template>
      <!-- 商店 -->
      <template v-if="state.hoverType == 'shop'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">商店</h1>
        <div class="flex">
          <div class="text-zinc-300 justify-center flex-wrap">
            <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 text-center">分类</p>
            <div class="h-60 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">补给品</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">药剂</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">埃克法轻工特供商品</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
              <p class=" px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">分类</p>
            </div>
          </div>
          <div class="text-zinc-300 w-150 justify-center flex-wrap">
            <div class="flex bg-zinc-700/50 px-2.5 py-1 rounded m-0.5">
              <p class="flex-1 text-center">物品名</p>
              <p class="w-20 text-center">库存</p>
              <p class="w-20 text-center mr-2.5">价格</p>
            </div>
            <div class="h-60 overflow-y-auto overflow-x-hidden overscroll-contain snap snap-y">
              <div class="flex px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">
                <p class="flex-1">物品名</p>
                <p class="w-20 text-center">20</p>
                <p class="w-20 text-center">50</p>
              </div>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
              <p class="px-2.5 py-1 rounded m-0.5 snap-center hover:bg-zinc-700/50">物品名</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>