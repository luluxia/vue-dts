<script setup lang="ts">
import { inject, nextTick, onMounted, reactive, ref } from 'vue'
import { command } from '../../utils/api'
import tippy, { hideAll } from 'tippy.js'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const skillNums = reactive<{ [key: string]: number }>({})
const skillSpecialData = reactive<{ [key: string]: any }>({})

// 百战
const veteranFlag = ref(false)
const veteranRef = ref()
const veteranListRef = ref()
// 灵感
const inspireFlag = ref(false)
const inspireRef = ref()
const inspireListRef = ref()

onMounted(() => {
  // 初始化技能升级次数与特殊数据
  gameState.playerState?.skill.forEach(skill => {
    if (!skill.unlockFlag && skill.num) {
      skillNums[skill.id] = 1
    }
    // 百战
    if (skill.id === 'c1_veteran') {
      veteranFlag.value = true
      skillSpecialData['c1_veteran'] = {
        now: skill.specialData.now,
      }
      nextTick(() => {
        tippy(veteranRef.value, {
          content: veteranListRef.value,
          trigger: 'click',
          interactive: true,
          allowHTML: true,
          arrow: false,
        })
      })
    }
    // 灵感
    if (skill.id === 'c10_inspire') {
      inspireFlag.value = true
      skillSpecialData['c10_inspire'] = {
        now: skill.specialData.now,
      }
      nextTick(() => {
        tippy(inspireRef.value, {
          content: inspireListRef.value,
          trigger: 'click',
          interactive: true,
          allowHTML: true,
          arrow: false,
        })
      })
    }
  })
})
// 使用技能
const useSkill = async (skill: any) => {
  let commandSend: any = { mode: 'revskpts', command: 'upgskill_' + skill.id }
  if (skill.num) {
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
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
  })
}
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">技能</h1>
  <div v-if="gameState.actionLog" class="mb-1" v-html="gameState.actionLog"></div>
  <div v-if="gameState.playerState?.skill.length === 0">
    你目前没有任何技能，先选择一个内定称号吧！
  </div>
  <div v-else class="space-y-1">
    <div class="bg-surfaceContainer rounded-sm" v-for="item in gameState.playerState?.skill">
      <div class="bg-surfaceContainerHighest px-2 py-1 flex justify-between items-center">
        <span class="">{{ item.name }}</span>
        <!-- 狙击鹰眼特殊技能 -->
        <div v-if="item.unlockFlag === 'skillpara|c4_roar-active'">
          <div @click="activeSkill('c4_roar')" class="inline-flex items-center rounded-sm cursor-pointer transition bg-primary text-onPrimary hover:bg-primary/80">
            <span class="m-auto px-2">解锁</span>
          </div>
        </div>
        <div v-if="item.unlockFlag === 'skillpara|c4_sniper-active'">
          <div @click="activeSkill('c4_sniper')" class="inline-flex items-center rounded-sm cursor-pointer transition bg-primary text-onPrimary hover:bg-primary/80">
            <span class="m-auto px-2">解锁</span>
          </div>
        </div>
        <!-- 通用操作 -->
        <div v-if="item.action" class="text-sm flex h-6" :class="item.unlockFlag && 'opacity-30 pointer-events-none'">
          <input v-if="item.num" v-model="skillNums[item.id]" class="bg-surfaceDim p-1 w-10 mr-1 rounded-sm" type="number">
          <div @click="useSkill(item)" class="inline-flex items-center rounded-sm cursor-pointer transition bg-primary text-onPrimary hover:bg-primary/80">
            <span class="m-auto px-2">{{ item.action }}</span>
          </div>
        </div>
      </div>
      <div class="relative group">
        <div v-if="item.unlockFlag" class="top-0 bottom-0 left-0 right-0 absolute bg-surfaceContainer/95 z-1 flex transition pointer-events-none group-hover:opacity-0">
          <div class="m-auto" v-html="item.unlockDesc"></div>
        </div>
        <div v-if="item.desc" class="skill-desc p-2" v-html="item.desc"></div>
        <!-- 百战 -->
        <template v-if="item.id === 'c1_veteran'">
          <!-- 说明 -->
          <div class="px-2 -mt-2 pb-2">
            <p>选择任一单体减半防御属性，你视为具有它。</p>
            <p>
              当前选择的是
              <span ref="veteranRef" class="px-1 rounded-sm bg-surfaceContainerHighest font-bold transition cursor-pointer hover:text-primary">
                {{ item.specialData.now }}
              </span>
              可随时改变
            </p>
          </div>
        </template>
        <!-- 附魔 -->
        <template v-if="item.id === 'c3_enchant'">
          <div class="px-2 -mt-2 pb-2">
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
              class="cursor-pointer transition hover:text-primary"
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
              <span ref="inspireRef" class="px-1 rounded-sm bg-surfaceContainerHighest font-bold transition cursor-pointer hover:text-primary">
                {{ item.specialData.now }}
              </span>
            </p>
          </div>
        </template>
      </div>
    </div>
    <!-- 百战选项 -->
    <div v-if="veteranFlag" ref="veteranListRef">
      <p
        v-for="option in gameState.playerState?.skill.find(i => i.id === 'c1_veteran')?.specialData.list"
        class="px-2.5 py-1 transition cursor-pointer hover:(bg-primary text-onPrimary)"
        @click="use_c1_veteran(option.id); hideAll();"
      >
        {{ option.title }}
      </p>
    </div>
    <!-- 灵感选项 -->
    <div v-if="inspireFlag" ref="inspireListRef">
      <p
        v-for="option in gameState.playerState?.skill.find(i => i.id === 'c10_inspire')?.specialData.list"
        class="px-2.5 py-1 transition cursor-pointer hover:(bg-primary text-onPrimary)"
        @click="use_c10_inspire(option.id); hideAll();"
      >
        {{ option.title }}
      </p>
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