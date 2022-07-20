<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from 'vue'
import Card from '../components/Card.vue'
import tippy, { createSingleton, hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
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
interface Item {
  type: string
  name: string
  active?: boolean
}
const state = inject('state', {
  showHover: false,
  hoverType: ''
})
// 行动
// 探索
const search = () => {
  // 发现物品
  state.hoverType = 'find-item'
  state.showHover = !state.showHover
  actionState.oldAction = actionState.action
  actionState.action = [
    { name: '获取', action: () => getItem() },
    { name: '丢弃', action: () => { state.showHover = false; actionState.action = actionState.oldAction } },
  ]
}
const findEnemy = () => {
  // 发现敌人
  state.hoverType = 'find-enemy'
  state.showHover = !state.showHover
  actionState.oldAction = actionState.action
  actionState.action = [
    { name: '攻击', action: () => {} },
    { name: '逃跑', action: () => { state.showHover = false; actionState.action = actionState.oldAction } },
  ]
}
const getItem = () => {
  actionState.item.push({ type: '物品', name: '石头' })
  actionState.action = actionState.oldAction
  state.showHover = !state.showHover
}
const map = () => {
  state.hoverType = 'map'
  state.showHover = !state.showHover
  actionState.action.map(action => {
    if (state.showHover) {
      action.name != '地图' && (action.active = false)
    } else {
      action.active = true
    }
  })
  actionState.disableItem = state.showHover
}
// 行动卡片
const actionState: ActionState = reactive({
  item: [
    { type: '物品', name: '物品1' },
    { type: '物品', name: '物品2' },
  ],
  action: [
    { name: '探索1', action: () => search() },
    { name: '探索2', action: () => findEnemy() },
    { name: '地图', action: () => map() },
    { name: '合成', action: () => {} },
    { name: '睡眠', action: () => {} },
    { name: '治疗', action: () => {} }
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
    delay: 100,
  })
})
</script>
<template>
  <!-- 物品悬浮窗 -->
  <div class="hidden">
    <div ref="tippyRef">
      <Card :length="2" :title="'物品'">
        <div v-if="actionState.hoverItem" class="p-1.5">
          <p>{{actionState.hoverItem.name}}</p>
        </div>
        <div @click="dropItem" class="bg-rose-700 flex rounded absolute right-1 bottom-1 px-2 py-1 cursor-pointer">
          <p class="m-auto text-xs">丢弃</p>
        </div>
      </Card>
    </div>
  </div>
  <div class="fixed flex bg-zinc-800/80 border-zinc-700/20 border-t-2 space-x-2 py-1 w-screen bottom-0">
    <TransitionGroup name="list" tag="div" class="flex m-auto items-center">
      <!-- 物品 -->
      <div
        v-for="item in actionState.item"
        class="tippy group transition-opacity"
        :class="actionState.disableItem && 'opacity-50 pointer-events-none'"
        :key="item.name"
      >
        <Card
          class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)"
          @click=""
          @mouseenter="hoverItem(item)"
          :title="item.type"
        >
          <p class="m-auto">{{item.name}}</p>
        </Card>
      </div>
      <!-- <p class="w-2" key="blank"></p> -->
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
          <p class="m-auto">{{item.name}}</p>
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
}
.tippy-content {
  padding: 0;
}
</style>