<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
onMounted(() => {
  tippy('.skill-desc span[tooltip]', {
    interactive: true,
    arrow: false,
    content: (el) => {
      const content = el.getAttribute('tooltip') ? el.getAttribute('tooltip') : '暂无说明'
      return content as string
    },
    theme: 'crafting',
    appendTo: () => document.body,
  })
  gameState.playerState?.skill.forEach(skill => {
    if (!skill.unlockFlag && skill.num) {
      skillNums[skill.id] = 1
    }
  })
})
const skillNums = reactive<{ [key: string]: number }>({})
const useSkill = async (skill: any) => {
  let commandSend: any = { mode: 'revskpts', command: 'upgskill_' + skill.id }
  if (skill.num) {
    commandSend['upgskill_' + skill.id] = skillNums[skill.id]
  }
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command(commandSend).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">技能</h1>
  <div v-if="gameState.actionLog" class="text-zinc-400 mb-2" v-html="gameState.actionLog"></div>
  <div v-if="gameState.playerState?.skill.length === 0" class="text-zinc-400">
    你目前没有任何技能，先选择一个内定称号吧！
  </div>
  <div v-else class="text-zinc-400 mb-2 max-h-150 overflow-y-scroll">
    <div class="bg-zinc-800 m-1 rounded-sm overflow-hidden" v-for="item in gameState.playerState?.skill">
      <div class="bg-zinc-700/80 text-zinc-300 px-2 py-1 flex justify-between items-center">
        <span class="">{{ item.name }}</span>
        <div v-if="item.action && !item.unlockFlag" class="text-sm flex h-6">
          <input v-if="item.num" v-model="skillNums[item.id]" class="bg-zinc-600 p-1 w-10 mr-1 rounded-sm" type="number">
          <div @click="useSkill(item)" class="inline-flex items-center rounded-sm cursor-pointer transition bg-slate-600 hover:bg-slate-500">
            <span class="m-auto px-2">{{ item.action }}</span>
          </div>
        </div>
      </div>
      <div class="relative">
        <div v-if="item.unlockFlag" class="top-0 bottom-0 left-0 right-0 absolute bg-zinc-800/90 z-1 flex transition cursor-default hover:opacity-0">
          <div class="m-auto" v-html="item.unlockDesc"></div>
        </div>
        <div class="skill-desc p-2" v-html="item.desc"></div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss">
.skill-desc span[tooltip].gold {
  @apply !block;
}
.skill-desc span[tooltip] {
  @apply !inline;
}
.skill-desc span[tooltip]::before {
  @apply !hidden;
}
.skill-desc span[tooltip]::after {
  @apply !hidden;
}
</style>