<script setup lang="ts">
import { inject } from 'vue'
import Card from './Card.vue'
import Item from './cards/Item.vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state') as GameState
const useItem = async (key: any) => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: key.replace('e', '') }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    state.drawerType = ''
  })
}
const dropItem = async (key: any) => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `drop${key.replace('e', '')}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    // state.drawerType = ''
  })
}
</script>
<template>
  <Card
    v-for="(item, key) of state.playerState?.bag"
    @click="useItem(key)"
    :title="item?.name && item.type" :length="4"
    :class="`${item?.name ? 'cursor-pointer group transition hover:(ring-zinc-500 ring-2)' : 'pointer-events-none border-2 border-dashed border-zinc-800 bg-transparent'}`"
  >
    <Item v-if="item" :item='item'/>
    <div v-if="item" class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
      <p @click.stop="dropItem(key)" class="m-auto text-xs px-3 py-1 rounded transition transition-colors bg-rose-900 hover:bg-rose-700">丢弃</p>
    </div>
  </Card>
</template>