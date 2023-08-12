<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, Ref } from 'vue'
import Card from './Card.vue'
import Item from './cards/Item.vue'
import Health from './cards/Health.vue'
import { command } from '../utils/api'
import type { GameState } from '../types/interface'
const state = inject<GameState>('state') as GameState
// 使用物品
const useItem = async (item: any, key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  if (item.rawName === '毒药') {
    state.drawerType = 'use-poison'
    state.useItemKey = key
    return
  } else if (item.rawName === '残响兵器') {
    state.drawerType = 'name-tag'
    state.useItemKey = key
    return
  } else if (['『灵魂宝石』', '『祝福宝石』'].includes(item.rawName)) {
    state.drawerType = 'strengthen'
    state.useItemKey = key
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: key.replace('e', '') }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    if (data.playerState.radar) {
      state.drawerType = 'radar'
    } else {
      state.drawerType = ''
    }
  })
}
// 丢弃物品
const dropItem = async (key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `drop${key.replace('e', '')}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
  })
}
// 存入背包
const encaseItem = async (key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  const index = key.replace('item', '')
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: 'itemencase', [`mitm${index}`]: index }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
  })
}
// 提炼物品
const splitItem = async (key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'itemmain', command: `split_itm${key.replace('item', '')}` }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
    state.drawerType = ''
  })
}
// 码语行人
const trait = (key: any) => {
  if (isMobile.value && selectItem.value !== key) {
    selectItem.value = key
    return
  }
  state.drawerType = 'trait'
  state.useItemKey = key
}
document.addEventListener('keydown', (e) => {
  if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
    state?.playerState?.bag[`item${e.key}`] && useItem(state?.playerState?.bag[`item${e.key}`], `item${e.key}`)
  }
})
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
  <template v-if="isMobile">
    <Card title="体征" :length="3">
      <Health/>
    </Card>
    <Card title="金钱" :length="1">
      <p class="m-auto">{{ state.playerState?.money }}</p>
    </Card>
  </template>
  <Card
    v-for="(item, key) of state.playerState?.bag"
    @click.stop="useItem(item, key)"
    :title="item?.name && `[${(key as string).replace('item', '')}]${item.type}`" :length="isMobile ? 2 : 4"
    :class="`${item?.name ? 'cursor-pointer' : 'pointer-events-none opacity-40'}`"
  >
    <Item v-if="item" :item='item'/>
    <div v-if="item" class="absolute right-1 bottom-1 space-y-0.5 text-center transition opacity-0 group-hover:(opacity-100)">
      <p
        v-if="state.playerState?.itemBag.isEquip"
        @click.stop="encaseItem(key)"
        class="
          text-xs px-2 py-1 rounded-sm transition
          bg-primary text-onPrimary
          hover:(bg-primary/60 <md:bg-primary)
        "
      >存入背包</p>
      <div class="flex space-x-0.5">
        <p
          v-if="state.playerState?.canAction['element']"
          @click.stop="splitItem(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-secondary text-onSecondary
            hover:(bg-secondary/60 <md:bg-secondary)
          "
        >提炼</p>
        <p
          v-if="state.playerState?.gift.nowGiftId == '21' && (item.typeID?.indexOf('D') === 0 || item.typeID?.indexOf('W') === 0)"
          @click.stop="trait(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-secondary text-onSecondary
            hover:(bg-secondary/60 <md:bg-secondary)
          "
        >提取</p>
        <p
          v-if="state.playerState?.gift.nowGiftId == '21' && item.typeID == '🥚'"
          @click.stop="trait(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-secondary text-onSecondary
            hover:(bg-secondary/60 <md:bg-secondary)
          "
        >插入</p>
        <p
          @click.stop="dropItem(key)"
          class="
            text-xs px-2 py-1 rounded-sm flex-1 transition
            bg-tertiary text-onTertiary
            hover:(bg-tertiary/60 <md:bg-tertiary)
          "
        >丢弃</p>
      </div>
    </div>
  </Card>
</template>