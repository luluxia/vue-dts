<!-- 元素口袋 -->
<script lang="ts" setup>
import { computed, inject, nextTick, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import Card from '../Card.vue'
import Message from '../Message'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const hint = computed(() => gameState.playerState?.element.hint)
const elements = computed(() => gameState.playerState?.element.elements)
const max = computed(() => gameState.playerState?.element.max)
actionState.action = [
  { name: '合成', action: () => craft() },
  { name: '放弃', action: () => back() },
]
const state = reactive({
  max: 0,
  percent: 45,
  haveNum: [0, 0, 0, 0, 0, 0],
  selectNum: [0, 0, 0, 0, 0, 0],
  pushedList: [] as { title: string; index: number, num: number }[],
  activeChangeMax: false,
  activeChangePercent: false,
})
onMounted(() => {
  state.max = max.value || 0
  state.haveNum = elements.value?.map((item) => Number(item.num)) || [0, 0, 0, 0, 0, 0]
  nextTick(() => {
    state.selectNum = elements.value?.map((item) => Number(item.num)) || [0, 0, 0, 0, 0, 0]
  })
})
const push = (index: number) => {
  if (state.pushedList.find((item) => item.index === index)) {
    state.pushedList.find((item) => item.index === index)!.num += Number(state.selectNum[index])
  } else {
    state.pushedList.push({
      title: elements.value && elements.value[index].title || '',
      index,
      num: Number(state.selectNum[index]),
    })
  }
  state.haveNum[index] -= state.selectNum[index]
  state.selectNum[index] = state.haveNum[index]
}
const unPush = (index: number) => {
  const pushedItem = state.pushedList.find((item) => item.index === index)
  if (pushedItem) {
    state.haveNum[index] += pushedItem.num
    state.pushedList.splice(state.pushedList.indexOf(pushedItem), 1)
    nextTick(() => {
      state.selectNum[index] = state.haveNum[index]
    })
  }
}
const craft = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: 'itemmain',
    command: 'elementmix',
    emixlist: state.pushedList.map((item) => `${item.index}`).join('+'),
    emixnums: state.pushedList.map((item) => `${item.num}`).join('+'),
    emax: state.max,
    change_emax: state.activeChangeMax ? 1 : 0,
    emixitmemax: Math.floor(state.max / max.value! * 100),
    change_emr: state.activeChangePercent ? 1 : 0,
    emixitmer: state.percent,
  }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'menu' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ''
    }
  })
}
const quickAdd = (e: any) => {
  const searchTarget = (e: any) : any => {
    if (e.parentElement) {
      if (e.parentElement.tagName == 'LI') {
        return e.parentElement
      } else {
        return searchTarget(e.parentElement)
      }
    } else {
      return null
    }
  }
  const target = searchTarget(e.target)
  if (!target) return
  if (!target.innerText.includes('份')) return
  const elementList = target.innerText.split('→')[0].split('+').map((e: string) => {
    return {
      id: ['亮晶晶', '暖洋洋', '冷冰冰', '郁萌萌', '昼闪闪', '夜静静'].findIndex((item) => item === e.split('份')[1].trim()),
      value: e.split('份')[0].trim(),
    }
  })
  let flag = true
  for (const element of elementList) {
    if (state.haveNum[element.id] < element.value) {
      Message({
        message: '当前拥有的元素不足以合成该道具',
      })
      flag = false
      return
    }
  }
  if (flag) {
    elementList.forEach((item: any) => {
      state.selectNum[item.id] = Number(item.value)
      push(item.id)
    })
  }
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">元素口袋</h1>
  <p class="mb-1">合成笔记</p>
  <div @click="e => quickAdd(e)" class="element-hint bg-surfaceContainer px-4 py-2 rounded mb-1" v-html="hint">

  </div>
  <template v-if="state.pushedList.length">
    <p class="mb-1">已投入</p>
    <div class="mb-1 flex">
      <p
        @click="unPush(element.index)"
        v-for="element in state.pushedList"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer"
      >
        {{ element.num }} 份<span v-html="element.title"></span>
      </p>
    </div>
  </template>
  <p class="mb-1">口袋</p>
  <div class="flex flex-wrap w-234">
    <card v-for="(element, index) in elements" :length="4" :width="18.5" :title="`${element.title}<span class='pl-2'>${element.num} 份</span>`">
      <div class="flex flex-col justify-between p-2 w-full">
        <div class="text-sm">
          <div class="space-x-2">
            <span class="font-bold">主</span>
            <span v-for="item in element.mainType" v-html="item.replace('[主]', '')"></span>
          </div>
          <div class="space-x-2">
            <span class="font-bold">次</span>
            <span v-for="item in element.subType" v-html="item.replace('[次]', '')"></span>
          </div>
        </div>
        <div class="flex items-center justify-between space-x-2">
          <input class="range flex-1 min-w-0 h-1" type="range" v-model="state.selectNum[index]" :max="state.haveNum[index]">
          <input class="w-14 text-sm px-1 py-0.5 rounded bg-surfaceDim" type="number" v-model="state.selectNum[index]" min="0" :max="state.haveNum[index]">
          <p @click="push(index)" class="text-sm px-2 py-0.5 rounded cursor-pointer transition transition-colors bg-primary text-onPrimary hover:bg-primary/80">投入</p>
        </div>
      </div>
    </card>
  </div>
  <p class="my-1">调整</p>
  <div class="flex mb-1">
    <Card :length="4" title="【数术】" :width="18.5" class="h-32">
      <div class="p-2 text-sm flex flex-col justify-between">
        <div>
          <p>投入份数<span class="green">最多(±10)</span>的一种或多种元素</p>
          <p>会成为<span class="green">主元素</span>，影响合成结果的<span class="green">类型</span>。</p>
        </div>
        <div>
          <p>投入的主元素为<span class="text-rose-500 font-bold"> 奇</span> / <span class="text-sky-500 font-bold">偶 </span>数份时，</p>
          <p>元素会展现<span class="text-rose-500 font-bold"> 第一</span> / <span class="text-sky-500 font-bold">第二 </span>个主特征。</p>
        </div>
      </div>
    </Card>
    <Card :length="4" title="【节制】" :width="18.5" class="h-32">
      <div class="p-2 text-sm flex flex-col justify-between w-full">
        <p>你可以主动限制元素合成结果的<span class="green">效耐上限</span>。</p>
        <p>当前：生成道具的效果+耐久上限<span class="yellow">【{{ state.max }}】</span></p>
        <div class="flex items-center justify-between">
          <input class="range w-60 h-1" type="range" v-model="state.max" :max="max">
          <p
            @click="state.activeChangeMax = !state.activeChangeMax"
            class="text-sm px-2 py-0.5 rounded cursor-pointer transition transition-colors bg-primary text-onPrimary hover:bg-primary/80"
            :class="state.activeChangeMax && '!bg-tertiary !hover:bg-tertiary/80'"
          >
            {{ state.activeChangeMax ? '禁用' : '启用' }}
          </p>
        </div>
      </div>
    </Card>
    <Card :length="4" title="【预言】" :width="18.5" class="h-32">
      <div class="p-2 text-sm flex flex-col justify-between w-full">
        <p>你能够干涉元素合成结果的<span class="green">效耐占比</span>。</p>
        <p>当前：效果占比<span class="yellow">【{{ state.percent }}%】</span>耐久占比<span class="yellow">【{{ 100 - state.percent }}%】</span></p>
        <p v-if="state.percent >= 80 || state.percent <= 20" class="red">警告：过度干预可能引发灾难性的后果！</p>
        <div class="flex items-center justify-between">
          <input class="range w-60 h-1" type="range" v-model="state.percent" min="2" max="98">
          <p
            @click="state.activeChangePercent = !state.activeChangePercent"
            class="text-sm px-2 py-0.5 rounded cursor-pointer transition transition-colors bg-primary text-onPrimary hover:bg-primary/80"
            :class="state.activeChangePercent && '!bg-tertiary !hover:bg-tertiary/80'"
          >
            {{ state.activeChangePercent ? '禁用' : '启用' }}
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>
<style lang="postcss">
.element-hint br:last-child {
  @apply hidden;
}
.element-hint ul {
  @apply my-1 px-4 space-y-1;
}
.element-hint ul:last-of-type {
  @apply mb-0;
}
.element-hint li {
  @apply list-none;
}
.element-hint span[tooltip] {
  @apply !inline;
}
.element-hint span[tooltip]::before {
  @apply !hidden;
}
.element-hint span[tooltip]::after {
  @apply !hidden;
}
</style>