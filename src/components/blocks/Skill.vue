<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away-subtle.css'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const skillNums = reactive<{ [key: string]: number }>({})
const skillSpecialData = reactive<{ [key: string]: any }>({})
onMounted(() => {
  // 初始化 tooltip
  tippy('.skill-desc span[tooltip], .skill-desc span[tooltip2]', {
    // interactive: true,
    arrow: false,
    content: (el) => {
      const content = el.getAttribute('tooltip') || el.getAttribute('tooltip2') || ''
      return content as string
    },
    theme: 'crafting',
    appendTo: () => document.body,
  })
  // 初始化技能升级次数与特殊数据
  gameState.playerState?.skill.forEach(skill => {
    if (!skill.unlockFlag && skill.num) {
      skillNums[skill.id] = 1
    }
    if (skill.id === 'c1_veteran') {
      skillSpecialData['c1_veteran'] = {
        showOptions: false,
        now: skill.specialData.now,
      }
    }
    if (skill.id === 'c10_inspire') {
      skillSpecialData['c10_inspire'] = {
        showOptions: false,
        now: skill.specialData.now,
      }
    }
  })
})
// 使用技能
const useSkill = async (skill: any) => {
  let commandSend: any = { mode: 'revskpts', command: 'upgskill_' + skill.id }
  if (skill.num) {
    // commandSend['upgskill_' + skill.id] = skillNums[skill.id]
    commandSend['upgskill_' + skill.id + '_nums'] = skillNums[skill.id]
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
// 激活技能
const activeSkill = async (id: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'actskill_' + id }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
// 使用百战
const use_c1_veteran = async (id: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'swtskill_c1_veteran', c1_veteranupgpara: id }).then(res => {
    skillSpecialData['c1_veteran'].showOptions = false
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
// 使用专注
const use_c5_focus = async (id: any) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'swtskill_c5_focus', c5_focusupgpara: id }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
// 使用灵感
const use_c10_inspire = async (id: any) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revskpts', command: 'swtskill_c10_inspire', c10_inspireupgpara: id }).then(res => {
    skillSpecialData['c10_inspire'].showOptions = false
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
  <div v-else class="text-zinc-400 mb-2 max-h-150 overflow-y-scroll overscroll-y-contain">
    <div class="bg-zinc-800 m-1 rounded-sm" v-for="item in gameState.playerState?.skill">
      <div class="bg-zinc-700/80 text-zinc-300 px-2 py-1 flex justify-between items-center">
        <span class="">{{ item.name }}</span>
        <!-- 狙击鹰眼特殊技能 -->
        <div v-if="item.unlockFlag === 'skillpara|c4_roar-active'">
          <div @click="activeSkill('c4_roar')" class="inline-flex items-center rounded-sm cursor-pointer transition bg-slate-600 hover:bg-slate-500">
            <span class="m-auto px-2">解锁</span>
          </div>
        </div>
        <div v-if="item.unlockFlag === 'skillpara|c4_sniper-active'">
          <div @click="activeSkill('c4_sniper')" class="inline-flex items-center rounded-sm cursor-pointer transition bg-slate-600 hover:bg-slate-500">
            <span class="m-auto px-2">解锁</span>
          </div>
        </div>
        <!-- 通用操作 -->
        <div v-if="item.action" class="text-sm flex h-6" :class="item.unlockFlag && 'opacity-30 pointer-events-none'">
          <input v-if="item.num" v-model="skillNums[item.id]" class="bg-zinc-600 p-1 w-10 mr-1 rounded-sm" type="number">
          <div @click="useSkill(item)" class="inline-flex items-center rounded-sm cursor-pointer transition bg-slate-600 hover:bg-slate-500">
            <span class="m-auto px-2">{{ item.action }}</span>
          </div>
        </div>
      </div>
      <div class="relative group">
        <div v-if="item.unlockFlag" class="top-0 bottom-0 left-0 right-0 absolute bg-zinc-800/90 z-1 flex transition pointer-events-none group-hover:opacity-0">
          <div class="m-auto" v-html="item.unlockDesc"></div>
        </div>
        <div v-if="item.desc" class="skill-desc p-2" v-html="item.desc"></div>
        <!-- 百战 -->
        <template v-if="item.id === 'c1_veteran'">
          <div class="px-2 -mt-2 pb-2">
            <p>选择任一单体减半防御属性，你视为具有它。</p>
            <p>
              当前选择的是
              <div class="inline-flex align-top justify-center items-center">
                <div
                  class="absolute z-1 bottom-10 bg-zinc-800 border-2 border-zinc-500 rounded p-0.5 transition opacity-0 pointer-events-none"
                  :class="skillSpecialData?.['c1_veteran']?.showOptions && '!opacity-100 !pointer-events-auto'"
                >
                  <p
                    v-for="option in item.specialData.list"
                    class="px-2.5 py-1 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)"
                    @click="use_c1_veteran(option.id)"
                  >
                    {{ option.title }}
                  </p>
                </div>
                <div
                  @click="skillSpecialData['c1_veteran'].showOptions = !skillSpecialData['c1_veteran'].showOptions"
                  class="px-1 flex rounded transition cursor-pointer hover:bg-zinc-800"
                >
                  <img class="w-5.5 mr-1" src="/img/menu.svg">
                  <p class="yellow">{{ item.specialData.now }}</p>
                </div>
              </div>
              可随时改变
            </p>
          </div>
        </template>
        <!-- 附魔 -->
        <template v-if="item.id === 'c3_enchant'">
          <div class="px-2 -mt-2 pb-2 text-zinc-500">
            <span v-for="i in item.specialData.list">
            {{ i.title }}+{{ i.value }}%
            </span>
          </div>
        </template>
        <!-- 专注 -->
        <template v-if="item.id === 'c5_focus'">
          <div class="px-2 -mt-2 pb-2">
            <p
              v-for="i in [[1, '遇敌率提高15%'], [0, '无效果'], [2, '物品发现率提高15%']]"
              class="cursor-pointer transition hover:text-zinc-300"
              @click="use_c5_focus(i[0])"
            >
              <span v-if="item.specialData.now == i[0]" class="yellow">[当前选择]</span>
              {{ i[1] }}
            </p>
          </div>
        </template>
        <!-- 灵感 -->
        <template v-if="item.id === 'c10_inspire'">
          <div class="px-2 -mt-2 pb-2">
            <p>
              当前选择的称号是
              <div class="inline-flex align-top justify-center items-center">
                <div
                  class="absolute z-1 bottom-10 bg-zinc-800 border-2 border-zinc-500 rounded p-0.5 transition opacity-0 pointer-events-none"
                  :class="skillSpecialData?.['c10_inspire']?.showOptions && '!opacity-100 !pointer-events-auto'"
                >
                  <p
                    v-for="option in item.specialData.list"
                    class="px-2.5 py-1 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)"
                    @click="use_c10_inspire(option.id)"
                  >
                    {{ option.title }}
                  </p>
                </div>
                <div
                  @click="skillSpecialData['c10_inspire'].showOptions = !skillSpecialData['c10_inspire'].showOptions"
                  class="px-1 flex rounded transition cursor-pointer hover:bg-zinc-800"
                >
                  <img class="w-5.5 mr-1" src="/img/menu.svg">
                  <p class="yellow">{{ item.specialData.now }}</p>
                </div>
              </div>
            </p>
          </div>
        </template>
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