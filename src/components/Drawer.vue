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
import Depot from './blocks/Depot.vue'
import Customize from './blocks/Customize.vue'
import CheckPoison from './blocks/CheckPoison.vue'

import type { GameState } from '../types/interface'
const state = inject<GameState>('state', {
  hideDrawer: false,
  drawerType: '',
  drawerHeight: 0,
})
const drawerDom = ref()
watch(() => state.playerState, () => {
  nextTick(() => {
    state.drawerHeight = drawerDom.value.getClientRects()[0].height
  })
})
watch(() => state.drawerType, () => {
  nextTick(() => {
    state.drawerHeight = drawerDom.value.getClientRects()[0].height
  })
})
</script>
<template>
  <div class="hide fixed w-screen h-20 bottom-0 z-2 pointer-events-none">
    <div
      @mouseenter="state.hideDrawer = true"
      @mouseleave="state.hideDrawer = false"
      class="absolute bottom-4 right-4 h-11 w-11 flex rounded border-2 border-zinc-700 bg-zinc-700/50 pointer-events-auto"
    >
      <img class="w-6 m-auto" src="img/hide.svg" alt=""/>
    </div>
  </div>
  <div
    class="drawer fixed w-screen bottom-0 left-15 flex bg-zinc-900/90 border-zinc-600/40 pb-2 border-t-2 transition pattern-diagonal-lines-sm text-zinc-50/1"
    :class="state.hideDrawer && 'opacity-0'"
    ref="drawerDom"
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
      <!-- 安全箱 -->
      <Depot v-else-if="state.drawerType == 'depot'"/>
      <!-- 带电/淬毒 -->
      <Customize v-else-if="state.drawerType == 'customize'"/>
      <!-- 检查毒物 -->
      <CheckPoison v-else-if="state.drawerType == 'check-poison'"/>
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
.redseed {
  @apply text-rose-600 font-bold;
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
.hide {
  view-transition-name: hide;
}
</style>