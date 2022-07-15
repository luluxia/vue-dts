<script lang="ts" setup>
import { inject } from 'vue'
import Card from './Card.vue'
import GameData from '../utils/data'
const state = inject('state', {
  showHover: false,
  hoverType: ''
})
</script>
<template>
  <div
    class="fixed bottom-0 left-0 right-0 flex bg-zinc-800/80 border-zinc-700/20 border-t-2 transition transform duration-300"
    :class="state.showHover ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
  >
    <div class="m-auto flex flex-col items-center pb-32">
      <template v-if="state.hoverType == 'find-item'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">发现物品</h1>
        <Card title="物品">

        </Card>
      </template>
      <template v-if="state.hoverType == 'map'">
        <img class="w-200" src="img/map.png" alt="">
        <div class="fixed w-200 px-10 py-10 text-zinc-200 font-bold text-sm text-shadow-lg grid grid-cols-10 grid-rows-10 text-center">
          <p
            class="flex justify-center items-center py-1 cursor-pointer" 
            :class="`row-start-${item.x} col-start-${item.y}`"
            v-for="item in GameData.map"
            v-html="item.name"
          ></p>
        </div>
      </template>
    </div>
  </div>
</template>