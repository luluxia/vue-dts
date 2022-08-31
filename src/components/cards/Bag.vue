<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject, ref, onMounted } from 'vue'
import tippy, { createSingleton, hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import Card from '../Card.vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    let left = 6
    Object.keys(gameState.playerState.bag).forEach((key) => {
      if (gameState.playerState && gameState.playerState.bag[key]) {
        left--
      }
    })
    return {
      bag: gameState.playerState.bag,
      money: gameState.playerState.money,
      left,
    }
  }
})
// 物品悬浮框
const tippyRef = ref()
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
    appendTo: () => document.body,
  })
})
</script>

<template>
  <!-- 背包悬浮窗 -->
  <div class="hidden">
    <div v-if="state" class="w-max" ref="tippyRef">
      <div class="flex">
        <Card
          :length="4"
          :title="state.bag.item1?.type"
          :class="state.bag.item1 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item1" type="bag" :item="state.bag.item1"/>
        </Card>
        <Card
          :length="4"
          :title="state.bag.item2?.type"
          :class="state.bag.item2 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item2" type="bag" :item="state.bag.item2"/>
        </Card>
      </div>
      <div class="flex">
        <Card
          :length="4"
          :title="state.bag.item3?.type"
          :class="state.bag.item3 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item3" type="bag" :item="state.bag.item3"/>
        </Card>
        <Card
          :length="4"
          :title="state.bag.item4?.type"
          :class="state.bag.item4 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item4" type="bag" :item="state.bag.item4"/>
        </Card>
      </div>
      <div class="flex">
        <Card
          :length="4"
          :title="state.bag.item5?.type"
          :class="state.bag.item5 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item5" type="bag" :item="state.bag.item5"/>
        </Card>
        <Card
          :length="4"
          :title="state.bag.item6?.type"
          :class="state.bag.item6 ? 'group transition hover:(ring-zinc-500 ring-2)' : 'border-2 border-dashed'"
        >
          <Item v-if="state.bag.item6" type="bag" :item="state.bag.item6"/>
        </Card>
      </div>
    </div>
  </div>
  <template v-if="state">
    <Card
      class="transform transition-all top-0 cursor-pointer relative group-hover:(-top-1) tippy group "
      title="背包" :length="2"
    >
      <div class="m-auto text-center">
        <p>剩余空间 {{state.left}}</p>
        <p>金币 {{state.money}}</p>
      </div>
    </Card>
  </template>
</template>