<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from 'vue'
import Card from '../components/Card.vue'
import Bag from './cards/Bag.vue'
import { test, command } from '../utils/api'

import type { GameState } from '../types/interface'
interface Action {
  name: string
  action: Function
  active?: boolean
}
interface ActionState {
  action: Array<Action>
  oldAction: Array<Action>
  disableItem: boolean // 是否禁用物品
  showDetail: boolean // 是否显示详情
}
const state = inject<GameState>('state', {
  showDrawer: false,
  drawerType: '',
  loading: false,
})
// 发现物品
const search = async () => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({mode: 'command', command: 'search'}).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    if (data.searchState.findEnemy) {
      // 发现敌人
      state.drawerType = 'find-enemy'
      state.showDrawer = !state.showDrawer
    } else if (data.searchState.findItem) {
      // 发现物品
      state.drawerType = 'find-item'
      state.showDrawer = !state.showDrawer
      actionState.oldAction = actionState.action
      actionState.action = [
        { name: '获取', action: () => getItem() },
        { name: '丢弃', action: () => { state.showDrawer = false; actionState.action = actionState.oldAction } },
      ]
    } else {
      state.log?.unshift({
        time: new Date().toLocaleTimeString(),
        content: `【行动】消耗15体力进行了搜索，但是什么都没有发现。`,
      })
    }
  })
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
  // actionState.item.push({ type: '物品', name: '石头' })
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
// 测试
const test = () => {
  actionState.showDetail = !actionState.showDetail
}
// 行动卡片
const actionState: ActionState = reactive({
  action: [
    { name: '探索1', action: () => search() },
    { name: '探索2', action: () => findEnemy() },
    { name: '地图', action: () => map() },
    { name: '合成', action: () => crafting() },
    { name: '睡眠', action: () => sleep() },
    { name: '治疗', action: () => heal() },
    { name: '战术', action: () => tactics() },
    { name: '商店', action: () => shop() },
    { name: '测试', action: () => test() },
  ],
  oldAction: [{ name: '', action: () => {} }],
  disableItem: false,
  showDetail: false,
  width: 0,
  height: 0,
})

</script>
<template>
  <div class="fixed flex w-screen bottom-0">
    <div class="p-2 my-4 mx-auto flex flex-col">
      <TransitionGroup name="list" tag="div" class="flex m-auto items-center bg-zinc-500/30">
        <!-- 背包 -->
        <div class="group transition-opacity" key="bag">
          <Bag/>
        </div>
        <!-- 行动 -->
        <div
          v-for="item in actionState.action"
          class="group transition-opacity"
          :class="item.active == false && 'opacity-50 pointer-events-none'"
          :key="item.name"
        >
          <div
            class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)"
            @click="() => {item.action()}"
          >
            <div class="text-zinc-300 px-4 py-2">
              <p class="m-auto">{{item.name}}</p>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
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