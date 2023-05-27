<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import type { GameState, ActionState, Item } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
watch(() => gameState.playerState?.hp.nowHp, (hp) => {
  if (hp !== undefined && hp <= 0) {
    gameState.showDeadInfo = true
    actionState.action = [
      { name: '查看死亡信息', action: () => gameState.showDeadInfo = true },
    ]
  }
}, { deep: true })
const deathInfo = computed(() => gameState.playerState?.death)
const close = () => {
  gameState.showDeadInfo = false
  actionState.action = [
    { name: '查看死亡信息', action: () => gameState.showDeadInfo = true },
  ]
}
</script>
<template>
  <div
    class="fixed w-screen h-screen top-0 bg-black/70 shadow flex transition opacity-0 pointer-events-none"
    :class="gameState.showDeadInfo && '!opacity-100 !pointer-events-auto'"
    @click="close()"
  >
    <div @click.stop="" class="m-auto text-zinc-300 bg-zinc-900/95 border-2 border-zinc-700 p-4 rounded flex flex-col relative">
      <img class="absolute right-0 bottom-0 opacity-50 pointer-events-none" src="old/img/rbfireseed.png" alt="">
      <p class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow pb-4 text-center">{{ deathInfo?.title }}</p>
      <div class="text-zinc-300 pb-6 relative" v-html="deathInfo?.content"></div>
      <p>死亡时间：{{ deathInfo?.time }}</p>
      <p v-if="deathInfo?.name">凶手：{{ deathInfo?.name }}</p>
      <p class="red">你死了。</p>
      <p @click="close()" class="w-max m-auto mt-2 px-3 py-1 rounded cursor-pointer transition transition-colors bg-slate-700 hover:bg-slate-500">我靠！</p>
    </div>
  </div>
</template>
<style lang="postcss">
.seedhint {
  @apply text-shadow-lg;
}
</style>