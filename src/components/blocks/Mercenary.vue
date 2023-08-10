<script lang="ts" setup>
import { computed, inject, onMounted, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { hideAll } from 'tippy.js'
import Card from '../Card.vue'
import { mapData } from '../../utils/data'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const mercenaryList = computed(() => gameState.playerState?.mercenary.mercList)
const moveList = computed(() => gameState.playerState?.mercenary.moveList)
const moveRefs = ref([])
const moveListRefs = ref()
onMounted(() => {
  moveRefs.value.forEach((ref, index) => {
    tippy(ref, {
      content: moveListRefs.value[index],
      trigger: 'click',
      interactive: true,
      allowHTML: true,
      arrow: false,
      appendTo: document.body,
    })
  })
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
const isMobile = inject('isMobile')
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">佣兵管理</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog"></div>
  <template v-if="mercenaryList?.length">
    你已经雇佣了{{ mercenaryList?.length }}名佣兵，以下是他们的情报：
  </template>
  <template v-else>
    你还没有雇佣任何佣兵。
  </template>
  <div v-if="mercenaryList?.length" class="mt-1">
    <div v-for="item in mercenaryList" class="flex flex-wrap">
      <Card :title="`佣兵${item.id}号`" :length="isMobile ? 2 : 3">
        <img class="absolute object-cover h-full rounded" :src="`/old/${item.avatar}`" alt="">
        <div class="m-auto px-1 relative w-full flex flex-col items-end">
          <p class="truncate tracking-wide bg-primaryContainer/80 text-onPrimaryContainer w-max px-1 rounded">{{ item.name }}</p>
          <p class="text-xs mt-1 px-1 opacity-80" v-html="item.friendShip"></p>
        </div>
      </Card>
      <Card title="状况" :length="isMobile ? 2 : 1">
        <p class="m-auto" v-html="item.status"></p>
      </Card>
      <Card title="工资" :length="isMobile ? 2 : 1">
        <span class="m-auto" :tooltip="`支付工资：${item.nextPay} 次行动后`">{{ item.salary }} 元</span>
      </Card>
      <Card title="位置" :length="2">
        <div class="m-auto text-center">
          <p>{{ item.position }}</p>
          <p v-if="item.canAssist" class="text-xs opacity-80">可协战</p>
        </div>
      </Card>
      <Card title="" :length="4" :width="18.5">
        <div class="m-auto space-y-1 text-sm">
          <p>花费<span class="yellow">{{ item.attackCost }}</span>元，可指挥佣兵主动出击
            <span v-if="item.canChase"> / <span class="yellow cursor-pointer" @click="chase(item.id)">追击</span></span>
          </p>
          <p>
            花费<span class="yellow">{{ item.moveCost }}</span>元，将佣兵移动到
            <span ref="moveRefs" class="px-1 rounded-sm bg-surfaceContainerHighest font-bold transition cursor-pointer hover:text-primary">
              {{ item.position }}
            </span>
            <!-- 移动列表 -->
            <div ref="moveListRefs" class="max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain">
              <p
                v-for="id in moveList"
                class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)"
                @click="move(item.id, id); hideAll();"
              >
                {{ mapData[id].name.replace('<br>', '') }}
              </p>
            </div>
          </p>
          <p>立刻<span class="yellow px-1 cursor-pointer" @click="fire(item.id)">解雇</span>该佣兵，之后该佣兵将{{ item.fireDesc }}</p>
        </div>
      </Card>
    </div>
  </div>
</template>