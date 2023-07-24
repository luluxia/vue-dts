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
onMounted(() => {
  if (gameState.playerState && gameState.playerState.hp.nowHp <= 0) {
    gameState.showDeadInfo = true
    actionState.action = [
      { name: '查看死亡信息', action: () => gameState.showDeadInfo = true },
    ]
  }
})
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
    class="fixed w-screen h-screen top-0 bg-black/40 flex transition opacity-0 pointer-events-none z-1"
    :class="gameState.showDeadInfo && '!opacity-100 !pointer-events-auto'"
    @click="close()"
  >
    <div @click.stop="" class="m-auto text-onSurface bg-surfaceContainer border-2 border-outline p-4 rounded flex flex-col relative">
      <!-- <img class="absolute right-0 bottom-0 opacity-50 pointer-events-none" src="old/img/rbfireseed.png" alt=""> -->
      <p class="text-xl text-primary font-bold tracking-wide pb-1 text-center">{{ deathInfo?.title }}</p>
      <div class="pb-1 relative" v-html="deathInfo?.content"></div>
      <p>死亡时间：{{ deathInfo?.time }}</p>
      <p v-if="deathInfo?.name">凶手：{{ deathInfo?.name }}</p>
      <p class="red">你死了。</p>
      <div @click="close()" class="ring-1.5 ring-primary p-0.5 cursor-pointer w-max m-auto">
        <p
          class="
              text-sm bg-primary pl-2.5 pr-2 py-1 text-onPrimary font-bold tracking-widest transition-colors
              hover:bg-transparent hover:text-primary
            "
          >我靠！
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="postcss">
.seedhint {
  @apply text-sm max-w-150 my-2;
}
</style>