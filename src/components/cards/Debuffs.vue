<script lang="ts" setup>
import { computed, inject } from 'vue'
import { command } from '../../utils/api'
import Card from '../Card.vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const state = computed(() => {
  if (gameState.playerState) {
    return {
      debuff: gameState.playerState.debuff
    }
  }
})
const infInfo = {
  b: { name: '胸部受伤', color: 'red' },
  h: { name: '头部受伤', color: 'red' },
  a: { name: '腕部受伤', color: 'red' },
  f: { name: '足部受伤', color: 'red' },
  p: { name: '中毒', color: 'purple' },
  u: { name: '灼伤', color: 'red' },
  i: { name: '冻伤', color: 'clan' },
  e: { name: '麻痹', color: 'yellow' },
  w: { name: '混乱', color: 'grey' }
} as any
const action = async (i: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'special', command: 'inf' + i }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
</script>

<template>
<template v-if="state">
<Card v-for="item in state.debuff" title="负面效果" :length="2">
  <div class="m-auto text-xl">
    <span
      v-if="infInfo[item]?.name && 'bhaf'.includes(item)"
      tooltip="消耗50体力包扎伤口"
      class="!font-normal cursor-pointer"
      :class="infInfo[item]?.color"
      @click="action(item)"
    >
      {{ infInfo[item].name }}
    </span>
    <span v-else-if="infInfo[item]?.name" class="!font-normal" :class="infInfo[item]?.color">
      {{ infInfo[item].name }}
    </span>
    <span v-else class="!font-normal">无</span>
  </div>
</Card>
</template>
</template>