<script lang="ts" setup>
import { inject, watch, ref, nextTick, onMounted } from 'vue'
import Card from './Card.vue'
import GameData from '../utils/data'
import tippy, { createSingleton, hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state', {
  showHover: false,
  hoverType: '',
  hoverHeight: 0,
})
const hoverDom = ref()
watch(() => state.showHover, (val) => {
  if (val) {
    nextTick(() => {
      state.hoverHeight = hoverDom.value.getClientRects()[0].height
      console.log(state.hoverHeight)
      // tippy('.tippy-tip', {
      //   content: '<p>用途 体力恢复/120/2</p><p>材料 杂炊 松茸</p>',
      //   allowHTML: true,
      //   arrow: false,
      //   trigger: 'click',
      // })
    })
  } else {
    state.hoverHeight = 0
  }
})
// onMounted(() => {
//   createSingleton(tippy('.tippy-tip', {
//     // content: () => tippyRef.value,
//     content: '123',
//     allowHTML: true,
//   }), {
//     interactive: true,
//     arrow: false,
//     moveTransition: 'transform 0.2s ease-out',
//     // delay: 100,
//     // trigger: 'click',
//     animation: 'shift-away-subtle',
//   })
// })
</script>
<template>
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
        <Card :length="2" title="物品">

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
          <p>消耗15点体力，移动到了端点。</p>
          <p>你发现了敌人？？？！</p>
          <p>对方好像完全没有注意到你！</p>
        </div>
        <div v-if="state.hoverType == 'attack-enemy'" class="text-zinc-400 text-sm mb-2">
          <p>你向✦执念的残火发起了攻击！</p>
          <p>使用乒乓球投掷✦执念的残火！</p>
          <p>你的攻击完全被✦执念的残火的装备吸收了！</p>
          <p>造成1点伤害！</p>
          <p>你用掉了1个乒乓球。</p>
          <p>“ΨХΛТΔЫЩΨΡ ЦΨΜПΨХЩЦ...”</p>
          <p>✦执念的残火攻击范围不足，不能反击，逃跑了！</p>
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
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">火水木金土符『贤者之石』</p>
          <p class="bg-zinc-700/50 px-2.5 py-1 rounded m-0.5 whitespace-nowrap">◆◆◆意念数据</p>
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
      <!-- 战术-->
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
    </div>
  </div>
</template>