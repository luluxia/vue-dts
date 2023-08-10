<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, Ref } from 'vue'
import Card from './Card.vue'
import Item from './cards/Item.vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state') as GameState
const offItem = async (key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  const type = ['wep', 'arb', 'arh', 'ara', 'arf', 'art'][['weapon', 'armor', 'helmet', 'arm', 'boot', 'accessory'].indexOf(key)]
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `off${type}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
    if (state.searchState?.findItem) {
      state.drawerType = 'find-item'
    } else {
      state.drawerType = ''
    }
  })
}
const switchWeapon = async () => {
  if (isMobile.value && selectItem.value !== 'weapon') {
    selectItem.value = 'weapon'
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'changewep' }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
  })
}
const specialWeapon = async () => {
  if (isMobile.value && selectItem.value !== 'weapon') {
    selectItem.value = 'weapon'
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: 'special', sp_cmd: 'sp_weapon' }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
  })
}
/** 移动端 */
const isMobile = inject('isMobile') as Ref<boolean>
const selectItem = ref('')
const clearSelectItem = () => {
  selectItem.value = ''
}
onMounted(() => {
  if (isMobile) {
    document.addEventListener('click', clearSelectItem)
  }
})
onUnmounted(() => {
  if (isMobile) {
    document.removeEventListener('click', clearSelectItem)
  }
})
</script>
<template>
  <Card
    @click.stop="item.name && item.quality != 0 && offItem(key)"
    v-for="(item, key) of state.playerState?.equipment"
    :title="item.name && item.type" :length="isMobile ? 2 : 4"
    :class="`
    ${!item.name && 'pointer-events-none opacity-40'}
    ${item.name && item.quality != 0 && 'cursor-pointer'}
    `"
  >
    <Item :item='item'/>
    <div class="absolute right-1 bottom-1 space-y-0.5 cursor-pointer">
      <template v-if="key === 'weapon'">
        <p
          @click.stop="switchWeapon()"
          class="
            text-xs px-2 py-1 rounded-sm transition
            bg-primary text-onPrimary
            hover:(bg-primary/60 <md:bg-primary)
          "
        >切换武器</p>
        <p
          @click.stop="specialWeapon()"
          class="
            text-xs px-2 py-1 rounded-sm transition
            bg-primary text-onPrimary
            hover:(bg-primary/60 <md:bg-primary)
          "
        >武器模式</p>
      </template>
      <p
        v-else-if="item.name && item.quality != 0"
        class="
          text-xs px-2 py-1 rounded-sm transition
          bg-secondary text-onSecondary
        "
      >装备中</p>
    </div>
  </Card>
</template>