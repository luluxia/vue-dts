<script lang="ts" setup>
import { inject, reactive } from 'vue'
import Card from '../components/Card.vue'
const state = inject('state', {
  showHover: false,
  hoverType: ''
})
// 行动
const search = () => {
  state.hoverType = 'find-item'
  state.showHover = !state.showHover
  actionState.action = [
    { name: '获取', action: () => {} },
    { name: '丢弃', action: () => {} },
  ]
  console.log('search')
}
const map = () => {
  state.hoverType = 'map'
  state.showHover = !state.showHover
  console.log('move')
}
// 行动卡片
const actionState = reactive({
  item: [1, 2, 3, 4, 5],
  action: [
    { name: '探索', action: () => search() },
    { name: '地图', action: () => map() },
    { name: '合成', action: () => {} },
    { name: '睡眠', action: () => {} },
    { name: '治疗', action: () => {} }
  ]
})

</script>
<template>
  <div class="fixed bottom-50">
    <p @click="() => {actionState.item.push(actionState.item.length + 1)}">add</p>
    <p @click="() => {actionState.item.shift()}">remove</p>
  </div>
  <div class="fixed flex bg-zinc-700/20 border-zinc-700/20 border-t-2 space-x-2 w-full bottom-0">
    <TransitionGroup name="list" tag="div" class="flex m-auto items-center">
      <Card
        class="transform transition hover:(-translate-y-1)"
        @click="() => {actionState.item.splice(item - 1, 1)}"
        v-for="item in actionState.item"
        :title="item.toString()"
        :key="item"
      />
      <p class="w-2" key="blank"></p>
      <Card
        v-for="item in actionState.action"
        class="transform transition cursor-pointer hover:(-translate-y-1)"
        :key="item.name"
        title="行动"
        @click="() => {item.action()}"
      >
        <p class="m-auto">{{item.name}}</p>
      </Card>
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
</style>