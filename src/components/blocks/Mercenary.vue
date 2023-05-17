<script lang="ts" setup>
import { computed, inject, onMounted, reactive } from 'vue'
import { command } from '../../utils/api'
import Card from '../Card.vue'
import gameData from '../../utils/data'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const mercenaryList = computed(() => gameState.playerState?.mercenary.mercList)
const moveList = computed(() => gameState.playerState?.mercenary.moveList)
const mercenaryState = reactive({
  showMoveList: false,
  showMoveListID: '',
})
const chase = async (id: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'actskill_c11_merc', c11_mercmkey: id, c11_mercchase: id }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
  })
}
const move = async (id: string, to: number) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'actskill_c11_merc', c11_mercmkey: id, [`c11_merc${id}moveto`]: to }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
const fire = async (id: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'actskill_c11_merc', c11_mercmkey: id, c11_mercfire: id }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">佣兵管理</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog"></div>
  <p class="text-zinc-400">
    <template v-if="mercenaryList?.length">
      你已经雇佣了{{ mercenaryList?.length }}名佣兵，以下是他们的情报：
    </template>
    <template v-else>
      你还没有雇佣任何佣兵。
    </template>
  </p>
  <div v-if="mercenaryList?.length" class="mt-2">
    <div v-for="item in mercenaryList" class="flex">
      <Card :title="`佣兵${item.id}号`" :length="3">
        <img class="absolute object-cover h-full avatar" :src="`/old/${item.avatar}`" alt="">
        <div class="m-auto px-4 relative w-full flex flex-col items-end">
          <p class="font-bold truncate tracking-wide bg-zinc-800/80 w-max px-1 rounded">{{ item.name }}</p>
          <p class="text-xs mt-1 px-1" v-html="item.friendShip"></p>
        </div>
      </Card>
      <Card title="状况">
        <p class="m-auto" v-html="item.status"></p>
      </Card>
      <Card title="工资">
        <span class="m-auto" :tooltip="`支付工资：${item.nextPay} 次行动后`">{{ item.salary }} 元</span>
      </Card>
      <Card title="位置" :length="2">
        <div class="m-auto text-center">
          <p>{{ item.position }}</p>
          <p v-if="item.canAssist" class="text-xs text-zinc-400">可协战</p>
        </div>
      </Card>
      <Card title="" :length="4">
        <div class="m-auto space-y-1 text-sm">
          <p>花费<span class="yellow">{{ item.attackCost }}</span>元，可指挥佣兵主动出击
            <span v-if="item.canChase"> / <span class="yellow cursor-pointer" @click="chase(item.id)">追击</span></span>
          </p>
          <p>
            花费<span class="yellow">{{ item.moveCost }}</span>元，将佣兵移动到
            <div class="inline-flex align-top justify-center items-center">
              <div
                class="absolute max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain z-1 bottom-18 bg-zinc-800 border-2 border-zinc-500 rounded p-0.5 transition opacity-0 pointer-events-none"
                :class="mercenaryState.showMoveList && mercenaryState.showMoveListID == item.id && '!opacity-100 !pointer-events-auto'"
              >
                <p
                  v-for="id in moveList"
                  class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)"
                  @click="move(item.id, id); mercenaryState.showMoveList = false"
                >
                  {{ gameData.map[id].name.replace('<br>', '') }}
                </p>
              </div>
              <div
                class="flex rounded transition cursor-pointer hover:bg-zinc-800"
                @click="mercenaryState.showMoveList = !mercenaryState.showMoveList; mercenaryState.showMoveListID = item.id"
              >
                <img class="w-5 mr-1" src="/img/menu.svg">
                <p class="yellow">{{ item.position }}</p>
              </div>
            </div>
          </p>
          <p>立刻<span class="yellow px-1 cursor-pointer" @click="fire(item.id)">解雇</span>该佣兵，之后该佣兵将{{ item.fireDesc }}</p>
        </div>
      </Card>
    </div>
  </div>
</template>