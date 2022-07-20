<script lang="ts" setup>
import { inject, watch, ref, nextTick } from 'vue'
import Card from './Card.vue'
import GameData from '../utils/data'
const state = inject('state', {
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
    })
  } else {
    state.hoverHeight = 0
  }
})
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
        <Card title="物品">

        </Card>
      </template>
      <template v-if="state.hoverType == 'find-enemy'">
        <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">发现敌人</h1>
        <!-- <div class="text-zinc-300 pb-2">
          <p>消耗15点体力，你搜索着周围的一切。。。</p>
          <p>你发现了敌人AC搬运职人！</p>
          <p>对方好像完全没有注意到你！</p>
          <p>现在想要做什么？</p>
        </div> -->
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
    </div>
  </div>
</template>