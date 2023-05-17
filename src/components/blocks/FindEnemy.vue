<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import Card from '../Card.vue'
import { command } from '../../utils/api'
import type { GameState, ActionState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const actionState = inject<ActionState>('actionState') as ActionState
const state = computed(() => {
  if (gameState.searchState) {
    return {
      actionLog: gameState.actionLog,
      enemy: gameState.searchState.findEnemy,
      battleState: gameState.searchState.findEnemy?.battleState,
    }
  }
})
const message = ref('')
onMounted(() => {
  if (state.value?.battleState === '发现敌人') {
    const attackType = gameState?.playerState?.attackType
    // 第一攻击方式
    actionState.action = [
      { name: attackType?.type1.name || '', action: () => attack(attackType?.type1.id || '') },
    ]
    // 第二攻击方式
    if (attackType?.type2.name) {
      actionState.action.push({ name: attackType.type2.name, action: () => attack(attackType.type2.id) })
    }
    // 换手
    actionState.action.push({ name: '切换', action: () => changeWeapon()})
    // 技能
    if (state.value.enemy?.battleSkills) {
      state.value.enemy.battleSkills.forEach((item: any) => {
        actionState.action.push({ name: item.title, action: () => useSkill(item.key), active: item.unlock, desc: item.desc })
      })
    }
    // 润了
    actionState.action.push({ name: '逃跑', action: () => back('revcombat') })
  } else if (state.value?.battleState === '遭遇突袭' || state.value?.battleState === '战斗发生') {
    actionState.action = [
      { name: '确定', action: () => back('command') },
    ]
  } else {
    // 发现尸体
    const actionList: any = []
    state.value?.enemy?.actionList?.forEach((item: any) => {
      actionList.push({ name: item.title, action: () => corpseAction(item.key) })
    })
    actionState.action = actionList
  }
})
// 攻击
const attack = async (type: string | null) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: type, message: message.value }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (state.value?.enemy?.actionList) {
      const actionList: any = []
      state.value?.enemy?.actionList.forEach((item: any) => {
        actionList.push({ name: item.title, action: () => corpseAction(item.key) })
      })
      actionState.action = actionList
    } else {
      actionState.action = [
        { name: '确定', action: () => back('command') },
      ]
    }
  })
}
// 技能
const useSkill = async (key: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: key, message: message.value }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (state.value?.enemy?.actionList) {
      const actionList: any = []
      state.value?.enemy?.actionList.forEach((item: any) => {
        actionList.push({ name: item.title, action: () => corpseAction(item.key) })
      })
      actionState.action = actionList
    } else {
      actionState.action = [
        { name: '确定', action: () => back('command') },
      ]
    }
  })
}
// 逃跑 / 确定
const back = async (mode: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: mode, command: 'back' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
// 切换武器
const changeWeapon = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'revcombat', command: 'changewep' }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog

    const attackType = gameState?.playerState?.attackType
    // 第一攻击方式
    actionState.action = [
      { name: attackType?.type1.name || '', action: () => attack(attackType?.type1.id || '') },
    ]
    // 第二攻击方式
    if (attackType?.type2.name) {
      actionState.action.push({ name: attackType.type2.name, action: () => attack(attackType.type2.id) })
    }
    // 换手
    actionState.action.push({ name: '切换', action: () => changeWeapon() })
    // 技能
    if (state.value?.enemy?.battleSkills) {
      state.value.enemy.battleSkills.forEach((item: any) => {
        actionState.action.push({ name: item.title, action: () => useSkill(item.key), active: item.unlock, desc: item.desc })
      })
    }
    // 润了
    actionState.action.push({ name: '逃跑', action: () => back('revcombat') })
  })
}
// 拾取物品相关
const selectItemKey = ref('')
const selectItem = (item: any) => {
  selectItemKey.value = item.key
  if (actionState.action[0].name.includes('拾取')) {
    actionState.action[0].name = '拾取 ' + item.name
    actionState.action[0].action = () => corpseAction(item.key)
  } else {
    actionState.action.unshift({ name: '拾取 ' + item.name, action: () => corpseAction(item.key) })
  }
}
const corpseAction = async (key: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: 'corpse', command: key }).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ''
  })
}
const action = async (title: string) => {
  if (title === '返回') {
    back('corpse')
  }
}
</script>
<template>
  <h1 class="text-zinc-300 text-2xl font-bold tracking-wide text-shadow py-2">
    {{ state?.enemy?.battleState }}
  </h1>
  <div class="text-zinc-400 mb-2">
    <p v-html="state?.actionLog"></p>
  </div>
  <!-- 敌人信息 -->
  <div v-if="state?.enemy" class="flex">
    <img
      v-if="state.enemy.hasBigAvatar"
      class="h-57 border-2 border-zinc-700 mr-0.25"
      :class="state.battleState === '发现尸体' && ' filter grayscale-80'"
      :src="`/old/img/${state.enemy.avatar}`"
    >
      <div>
        <div class="flex">
        <Card :title="state.enemy.type" :length="2">
          <div class="flex w-full">
            <img
              v-if="!state.enemy.hasBigAvatar"
              class="absolute w-full h-full object-cover -z-1 opacity-30"
              :class="state.battleState === '发现尸体' && ' filter grayscale-80'"
              :src="`/old/img/${state.enemy.avatar}`"
            >
            <div class="flex-1 flex">
              <div class="m-auto">
                <p class="font-bold">{{ state.enemy.name }}</p>
                <p class="text-xs mt-1">{{ state.enemy.title }}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card title="等级">
          <div class="m-auto text-center">
            <p class="text-2xl">{{ state.enemy.level }}</p>
          </div>
        </Card>
        <!-- 生命 -->
        <Card title="生命">
          <div class="m-auto text-center">
            <p v-html="state.enemy.hp"></p>
          </div>
        </Card>
        <!-- 体力 -->
        <Card title="体力">
          <div class="m-auto text-center">
            <p v-html="state.enemy.mp"></p>
          </div>
        </Card>
        <!-- 怒气 -->
        <Card title="怒气">
          <div class="m-auto text-center">
            <p v-html="state.enemy.rage"></p>
          </div>
        </Card>
        <!-- 受伤部位 -->
        <Card title="受伤部位" :length="2">
          <div class="flex w-full">
            <div class="flex-1 flex">
              <div class="m-auto">
                <p v-html="state.enemy.hurt"></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="flex">
        <!-- 基础姿态 -->
        <Card title="基础姿态" :length="2">
          <div class="m-auto text-center">
            <p v-html="state.enemy.tactic"></p>
          </div>
        </Card>
        <!-- 应战策略 -->
        <Card title="应战策略" :length="2">
          <div class="m-auto text-center">
            <p v-html="state.enemy.pose"></p>
          </div>
        </Card>
        <!-- 武器 -->
        <Card :length="4" :title="state.enemy.weaponType">
          <div class="flex w-full p-2 items-center">
            <div class="flex flex-col flex-1 h-full justify-between">
              <div class="ml-0.5">
                <p v-html="state.enemy.weapon" class="font-bold text-sm"></p>
              </div>
              <p class="text-sm space-x-1 mt-1">
                <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 {{ state.enemy.attack }}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
  <!-- 掉落物品信息 -->
  <template v-if="state?.battleState === '发现尸体'">
    <p class="text-zinc-400 mt-2">想要从尸体上拾取什么？</p>
    <div class="text-zinc-300 flex justify-center flex-wrap mt-1 -mb-1 max-w-200">
      <p
        v-for="(item, key) in state?.enemy?.items"
        @click="selectItem(item)"
        :class="selectItemKey == item.key && 'ring-2 ring-zinc-500'"
        class="bg-zinc-700/80 px-2.5 py-1 rounded-sm m-1 cursor-pointer transition"
      >
        <span>
          <span class="text-zinc-400" v-if="item.type">
            [<span class="inline-flex" v-html="item.type"></span>]
          </span>
          {{ item.name }}
          <template v-if="item.type">
            / {{ item.quality }}
            / {{ item.durability }}
          </template>
          <template v-if="item.props">
            / <span class="inline-flex" v-html="item.props"></span>
          </template>
        </span>
      </p>
    </div>
  </template>
  <!-- 战斗喊话 -->
  <template v-if="state?.battleState === '发现敌人'">
    <p class="text-zinc-400 m-2">向对手大喊：</p>
    <input v-model="message" class="p-1 bg-zinc-700 text-zinc-300 rounded text-center" type="text">
  </template>
  <div class="text-zinc-400 mt-2">
    <p>现在想要做什么？</p>
  </div>
</template>