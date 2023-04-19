<script lang="ts" setup>
import { computed } from 'vue'
import { inject } from 'vue'
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
//$infinfo = Array('b' => '<span class="red">胸</span>', 'h' => '<span class="red">头</span>', 'a' => '<span class="red">腕</span>', 'f' => '<span class="red">足</span>', 'p' => '<span class="purple">毒</span>', 'u' => '<span class="red">烧</span>', 'i' => '<span class="clan">冻</span>', 'e' => '<span class="yellow">麻</span>','w' => '<span class="grey">乱</span>');

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
</script>

<template>
<template v-if="state">
<Card v-for="item in state.debuff" title="负面效果" :length="2">
  <div class="m-auto">
    <p class="text-xl !font-normal" :class="infInfo[item]?.color">{{ infInfo[item]?.name || '无' }}</p>
  </div>
</Card>
</template>
</template>