<script lang="ts" setup>
import { inject, watch, ref, nextTick } from 'vue'

import Map from './blocks/Map.vue'
import Tactic from './blocks/Tactics.vue'
import FindItem from './blocks/FindItem.vue'
import FindEnemy from './blocks/FindEnemy.vue'
import FindTeam from './blocks/FindTeam.vue'
import Crafting from './blocks/Crafting.vue'
import Arrange from './blocks/Arrange.vue'
import Rest from './blocks/Rest.vue'
import Team from './blocks/Team.vue'
import Skill from './blocks/Skill.vue'
import Shop from './blocks/Shop.vue'

import Card from './Card.vue'
import gameData from '../utils/data'
import tippy, { createSingleton } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state', {
  showDrawer: false,
  drawerType: '',
  drawerHeight: 0,
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
watch(() => state.showDrawer, (val) => {
  if (val) {
    nextTick(() => {
      state.drawerHeight = hoverDom.value.getClientRects()[0].height
      console.log(state.drawerHeight)
      tippys.forEach(item => item.destroy())
      tippys = tippy('.tippy-tip', {
        content: () => tippyRef.value.cloneNode(true),
        allowHTML: true,
      })
      console.log(tippys)
      singleton.setInstances(tippys)
    })
  } else {
    state.drawerHeight = 0
  }
})
watch(() => state.playerState, (val) => {
  nextTick(() => {
    state.drawerHeight = hoverDom.value.getClientRects()[0].height
    // const timerDom = document.querySelector('#timer') as HTMLElement
    // if (val && timerDom) {
    //   let num = 1
    //   const countdown = setInterval(function() {
    //     num -= 0.01
    //     timerDom.innerHTML = Math.abs(num).toFixed(2)
    //     if (num < 0) {
    //       clearInterval(countdown)
    //     }
    //   }, 10)
    // }
  })
})
watch(() => state.drawerType, (val) => {
  nextTick(() => {
    state.drawerHeight = hoverDom.value.getClientRects()[0].height
  })
})
</script>
<template>
  <div
    class="drawer fixed bottom-0 w-screen flex bg-zinc-900/90 border-zinc-600/40 pb-2 border-t-2 left-15 pattern-diagonal-lines-sm text-zinc-50/1"
    ref="hoverDom"
  >
    <div class="m-auto flex flex-col items-center pb-16 pr-30">
      <!-- 发现物品 -->
      <FindItem v-if="state.drawerType == 'find-item'" />
      <!-- 敌人相关 -->
      <FindEnemy v-else-if="state.drawerType == 'find-enemy'" />
      <!-- 发现队伍 -->
      <FindTeam v-else-if="state.drawerType == 'find-team'" />
      <!-- 地图 -->
      <Map v-else-if="state.drawerType == 'map'" />
      <!-- 合成 -->
      <Crafting v-else-if="state.drawerType == 'crafting'"/>
      <!-- 整理 -->
      <Arrange v-else-if="state.drawerType == 'arrange'"/>
      <!-- 睡眠/治疗 -->
      <Rest v-else-if="state.drawerType == 'rest'"/>
      <!-- 战术 -->
      <Tactic v-else-if="state.drawerType == 'tactics'"/>
      <!-- 队伍 -->
      <Team v-else-if="state.drawerType == 'team'"/>
      <!-- 技能 -->
      <Skill v-else-if="state.drawerType == 'skill'"/>
      <!-- 商店 -->
      <Shop v-else-if="state.drawerType == 'shop'"/>
      <!-- 默认 -->
      <template v-else>
        <div class="text-zinc-400 mt-2">
          <p v-html="state.actionLog"></p>
          <p class="text-center mt-1">现在想要做什么？</p>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="postcss">
.yellow {
  @apply text-yellow-500 font-bold;
}
.red {
  @apply text-red-600 font-bold;
}
.purple {
  @apply text-purple-600 font-bold;
}
.lime {
  @apply text-lime-600 font-bold;
}
.clan {
  @apply text-sky-600;
}
.gold {
  @apply text-yellow-600 font-bold;
}
.drawer {
  view-transition-name: drawer;
}
</style>