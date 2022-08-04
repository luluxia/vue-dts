<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from 'vue'
import Card from '../components/Card.vue'
import { test } from '../utils/api'
import tippy, { createSingleton, hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState } from '../types/interface'
interface ActionState {
  item: Array<Item>
  action: Array<Action>
  oldAction: Array<Action>
  disableItem: boolean // 是否禁用物品
  hoverItem: Item | null // 鼠标悬停的物品
}
interface Action {
  name: string
  action: Function
  active?: boolean
}
/** test */
interface Item {
  /** 物品 */
  type: string
  name: string
  active?: boolean
}
const state = inject<GameState>('state', {
  showDrawer: false,
  drawerType: '',
  loading: false,
})
// 行动
// 发现物品
const search = async () => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await test()
  window.clearTimeout(waitTimer)
  if (state.playerState) {
    state.playerState.mp.nowMp -= 15
  }
  state.loading = false
  state.drawerType = 'find-item'
  state.showDrawer = !state.showDrawer
  actionState.oldAction = actionState.action
  actionState.action = [
    { name: '获取', action: () => getItem() },
    { name: '丢弃', action: () => { state.showDrawer = false; actionState.action = actionState.oldAction } },
  ]
}
// 发现敌人
const findEnemy = () => {
  state.drawerType = 'find-enemy'
  state.showDrawer = !state.showDrawer
  actionState.oldAction = actionState.action
  actionState.action = [
    { name: '攻击', action: () => attackEnemy() },
    { name: '逃跑', action: () => { state.showDrawer = false; actionState.action = actionState.oldAction } },
  ]
}
// 攻击敌人
const attackEnemy = () => {
  state.drawerType = 'attack-enemy'
  state.playerState && (state.playerState.playerInfo.name = '123')
  console.log(state.playerState?.playerInfo.name)
  actionState.action = [
    { name: '确定', action: () => { state.showDrawer = false; actionState.action = actionState.oldAction } }
  ]
}
// 获取物品
const getItem = async () => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await test()
  window.clearTimeout(waitTimer)
  state.loading = false
  actionState.item.push({ type: '物品', name: '石头' })
  actionState.action = actionState.oldAction
  state.showDrawer = !state.showDrawer
}
// 打开地图
const map = () => {
  state.drawerType = 'map'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '地图' && (action.active = false)
    } else {
      action.active = true
    }
  })
  actionState.disableItem = state.showDrawer
}
// 打开合成页面
const crafting = () => {
  state.drawerType = 'crafting'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '合成' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 打开睡眠
const sleep = () => {
  state.drawerType = 'sleep'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '睡眠' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 治疗
const heal = () => {
  state.drawerType = 'heal'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '治疗' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 战术
const tactics = () => {
  state.drawerType = 'tactics'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '战术' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 商店
const shop = () => {
  state.drawerType = 'shop'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '商店' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 行动卡片
const actionState: ActionState = reactive({
  item: [
    { type: '背包', name: '物品1' },
  ],
  action: [
    { name: '探索1', action: () => search() },
    { name: '探索2', action: () => findEnemy() },
    { name: '地图', action: () => map() },
    { name: '合成', action: () => crafting() },
    { name: '睡眠', action: () => sleep() },
    { name: '治疗', action: () => heal() },
    { name: '战术', action: () => tactics() },
    { name: '商店', action: () => shop() },
  ],
  oldAction: [{ name: '', action: () => {} }],
  disableItem: false,
  hoverItem: null
})
// 物品悬浮框
const tippyRef = ref()
const dropItem = () => {
  actionState.item.pop()
  hideAll()
}
const hoverItem = (item: Item) => {
  actionState.hoverItem = item
}
onMounted(() => {
  createSingleton(tippy('.tippy', {
    content: () => tippyRef.value,
    allowHTML: true,
  }), {
    interactive: true,
    arrow: false,
    moveTransition: 'transform 0.2s ease-out',
    // delay: 100,
    trigger: 'click',
    animation: 'shift-away-subtle',
  })
})
</script>
<template>
  <!-- 背包悬浮窗 -->
  <div class="hidden">
    <div class="w-max" ref="tippyRef">
      <div class="flex">
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
          <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
            <p class="m-auto text-xs px-3 py-1 bg-zinc-600 rounded">快捷</p>
            <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
          </div>
        </Card>
        <Card :length="4" :title="'物品'" class="group transition hover:(ring-zinc-500 ring-2)">
          <div class="p-1.5">
            <p>物品名</p>
          </div>
          <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
            <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
          </div>
        </Card>
      </div>
      <div class="flex">
        <Card :length="4" class="border-2 border-dashed"/>
        <Card :length="4" class="border-2 border-dashed"/>
      </div>
      <div class="flex">
        <Card :length="4" class="border-2 border-dashed"/>
        <Card :length="4" class="border-2 border-dashed"/>
      </div>
    </div>
  </div>
  <div class="fixed flex bg-zinc-800/80 border-zinc-700/20 border-t-2 space-x-2 py-1 w-screen bottom-0">
    <TransitionGroup name="list" tag="div" class="flex m-auto items-center">
      <!-- 背包 -->
      <div class="tippy group transition-opacity" key="bag">
        <Card
          class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)"
          title="背包" :length="2"
        >
          <div class="m-auto text-center">
            <p>空间 3 / 6</p>
            <p>金币 50</p>
          </div>
        </Card>
      </div>
      <!-- 行动 -->
      <div
        v-for="item in actionState.action"
        class="group transition-opacity"
        :class="item.active == false && 'opacity-50 pointer-events-none'"
        :key="item.name"
      >
        <Card
          class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)"
          title="行动"
          @click="() => {item.action()}"
        >
          <div class="m-auto text-center">
            <!-- <img class="w-12 h-12" src="img/item.png" alt=""> -->
            <p class="m-auto">{{item.name}}</p>
          </div>
        </Card>
      </div>
    </TransitionGroup>
  </div>
  <!-- <div class="text-white">
    <p @click="() => {test.push(test.length + 1)}">add</p>
    <p @click="() => {test.shift()}">remove</p>
    <div class="w-200">
      <TransitionGroup name="list" tag="ul" class="flex m-auto w-max">
        <Card v-for="item in test" :title="item.toString()" :key="item" />
      </TransitionGroup>
    </div>
  </div> -->
</template>
<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.list-leave-to {
  opacity: 0;
}
.list-move.list-leave-to {
  transition: none;
}
.list-leave-active {
  position: absolute;
}
.tippy-box {
  border: 2px solid rgb(255 255 255 / 20%);
  box-shadow: 0 0 2px 2px rgb(0 0 0 / 20%);
  max-width: max-content !important;
  padding: 0.125em;
  background-color: #252528;
}
.tippy-content {
  padding: 0em;
}
</style>