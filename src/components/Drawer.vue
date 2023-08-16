<script lang="ts" setup>
import { inject, watch, ref, nextTick } from 'vue'
import { command } from '../utils/api'

import Semo from './Semo.vue'
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
import UsePoison from './blocks/UsePoison.vue'
import Mercenary from './blocks/Mercenary.vue'
import Radar from './blocks/Radar.vue'
import NameTag from './blocks/NameTag.vue'
import Strengthen from './blocks/Strengthen.vue'
import Element from './blocks/Element.vue'
import ControlPanel from './blocks/ControlPanel.vue'
import Search from './blocks/Search.vue'
import Trait from './blocks/Trait.vue'

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
// 探索
const search = async () => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({mode: 'command', command: 'search'}).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
    if (data.searchState.findEnemy) {
      // 发现敌人
      state.drawerType = 'find-enemy'
    } else if (data.searchState.findItem) {
      // 发现物品
      state.drawerType = 'find-item'
    }
  })
}
document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyZ' && !state.drawerType) {
    search()
  }
})
const isMobile = inject('isMobile')
</script>

<template>
  <!-- <div class="hide fixed w-screen h-20 bottom-0 z-2 pointer-events-none">
    <div
      @mouseenter="state.hideDrawer = true"
      @mouseleave="state.hideDrawer = false"
      class="absolute bottom-4 right-4 h-11 w-11 flex rounded border-2 border-primary/20 bg-primaryContainer/95 text-onPrimaryContainer pointer-events-auto <sm:bottom-28"
    >
      <svg class="stroke-onSurface m-auto" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M42 42L6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/></svg>
    </div>
  </div> -->
  <div
    class="
      drawer w-screen mb-2 flex flex-col pointer-events-none z-1
      <md:(m-0)
    "
    ref="drawerDom"
  >
    <div
      class="
        relative m-auto flex flex-col items-center p-2 rounded text-sm
        max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain pointer-events-auto
        border-2 border-outlineVariant bg-surface/95 text-onSurface
        <md:(px-2 pt-0 m-0 rounded-none w-screen border-none max-h-[calc(100vh-12rem)])
      "
    >
      <div
        v-if="!isMobile"
        @mouseenter="state.hideDrawer = true"
        @mouseleave="state.hideDrawer = false"
        class="absolute p-0.5 bg-surfaceContainer/95 rounded right-1 top-1 z-1"
      >
        <svg class="stroke-onSurface m-auto opacity-60" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M42 42L6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/></svg>
      </div>
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
      <!-- 下毒 -->
      <UsePoison v-else-if="state.drawerType == 'use-poison'"/>
      <!-- 佣兵 -->
      <Mercenary v-else-if="state.drawerType == 'mercenary'"/>
      <!-- 雷达 -->
      <Radar v-else-if="state.drawerType == 'radar'"/>
      <!-- 命名 -->
      <NameTag v-else-if="state.drawerType == 'name-tag'"/>
      <!-- 强化 -->
      <Strengthen v-else-if="state.drawerType == 'strengthen'"/>
      <!-- 元素口袋 -->
      <Element v-else-if="state.drawerType == 'element'"/>
      <!-- 控制面板 -->
      <ControlPanel v-else-if="state.drawerType == 'control-panel'"/>
      <!-- 搜索 -->
      <Search v-else-if="state.drawerType == 'search'"/>
      <!-- 码语行人 -->
      <Trait v-else-if="state.drawerType == 'trait'"/>
      <!-- 默认 -->
      <template v-else>
        <div class="<md:w-full">
          <p class="w-max mx-auto max-w-full" v-html="state.actionLog"></p>
          <p class="text-center mb-1">现在想要做什么？</p>
          <Semo/>
          <p
            @click="search()"
            class="
              w-full mt-1 text-center p-2 cursor-pointer rounded
              bg-primary text-onPrimary ring-primary/40
              transition hover:ring-2
            "
          ><span class="<md:hidden">[Z] </span>探索</p>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="postcss">
.yellow {
  @apply text-yellow-600 font-bold;
}
.red {
  @apply text-rose-600 font-bold;
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
.grey {
  @apply opacity-80;
}
.green {
  @apply text-green-600 font-bold;
}
.blueseed {
  @apply text-sky-600 font-bold;
}
.evergreen {
  @apply text-green-600 font-bold;
}
.ltcrimson {
  @apply text-rose-600;
}
.seagreen {
  @apply text-teal-600;
}
.drawer {
  view-transition-name: drawer;
}
.hide {
  view-transition-name: hide;
}
</style>