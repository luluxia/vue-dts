<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue"
import Card from "../Card.vue"
import { command } from "../../utils/api"
import type { GameState, ActionState } from "../../types/interface"
const gameState = inject<GameState>("state") as GameState
const actionState = inject<ActionState>("actionState") as ActionState
const state = computed(() => {
  if (gameState.searchState) {
    return {
      actionLog: gameState.actionLog,
      enemy: gameState.searchState.findEnemy,
      battleState: gameState.searchState.findEnemy?.battleState,
    }
  }
})
const message = ref("")
const showDialog = ref(false)
onMounted(() => {
  if (state.value?.battleState === "发现敌人") {
    const attackType = gameState?.playerState?.attackType
    // 第一攻击方式
    actionState.action = [
      {
        name: attackType?.type1.name || "",
        action: () => attack(attackType?.type1.id || ""),
        shortcut: "z",
      },
    ]
    // 第二攻击方式
    if (attackType?.type2) {
      actionState.action.push({
        name: attackType.type2.name,
        action: () => attack(attackType?.type2?.id || ""),
      })
    }
    // 换手
    actionState.action.push({ name: "切换", action: () => changeWeapon(), shortcut: "c" })
    // 技能
    if (state.value.enemy?.battleSkills) {
      state.value.enemy.battleSkills.forEach((item: any) => {
        actionState.action.push({
          name: item.title,
          action: () => useSkill(item.key),
          active: item.unlock,
          desc: item.desc,
        })
      })
    }
    // 查看敌方技能
    if (state.value?.enemy?.skill) {
      actionState.action.push({
        name: "查看敌方技能",
        action: () => enemySkill(),
      })
    }
    // 润了
    actionState.action.push({ name: "逃跑", action: () => back("revcombat"), shortcut: "x" })
  } else if (
    state.value?.battleState === "遭遇突袭" ||
    state.value?.battleState === "战斗发生"
  ) {
    actionState.action = []
    // 查看敌方技能
    if (state.value?.enemy?.skill) {
      actionState.action.push({
        name: "查看敌方技能",
        action: () => enemySkill(),
      })
    }
    actionState.action.push({ name: "确定", action: () => back("command"), shortcut: "z" })
  } else {
    // 发现尸体
    const actionList: any = []
    state.value?.enemy?.actionList?.forEach((item: any) => {
      actionList.push({
        name: item.title,
        action: () => corpseAction(item.key),
      })
    })
    actionState.action = actionList
    // 默认拾取金钱
    const moneyItem = state.value?.enemy?.items.find(item => item.key === 'money')
    if (moneyItem) {
      selectItem(moneyItem)
    }
  }
})
// 攻击
const attack = async (type: string | null) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: "revcombat",
    command: type,
    message: message.value,
  }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    actionState.action = []
    // 查看敌方技能
    if (state.value?.enemy?.skill) {
      actionState.action.push({
        name: "查看敌方技能",
        action: () => enemySkill(),
      })
    }
    if (state.value?.enemy?.actionList) {
      state.value?.enemy?.actionList.forEach((item: any) => {
        actionState.action.push({
          name: item.title,
          action: () => corpseAction(item.key),
        })
      })
    } else {
      actionState.action.push({ name: "确定", action: () => back("command"), shortcut: "z" })
    }
    // 默认拾取金钱
    const moneyItem = state.value?.enemy?.items?.find(item => item.key === 'money')
    if (moneyItem) {
      selectItem(moneyItem)
    }
  })
}
// 技能
const useSkill = async (key: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: "revcombat",
    command: key,
    message: message.value,
  }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    actionState.action = []
    // 查看敌方技能
    if (state.value?.enemy?.skill) {
      actionState.action.push({
        name: "查看敌方技能",
        action: () => enemySkill(),
      })
    }
    if (state.value?.enemy?.actionList) {
      state.value?.enemy?.actionList.forEach((item: any) => {
        actionState.action.push({
          name: item.title,
          action: () => corpseAction(item.key),
        })
      })
      // 默认拾取金钱
      const moneyItem = state.value?.enemy?.items.find(item => item.key === 'money')
      if (moneyItem) {
        selectItem(moneyItem)
      }
    } else {
      actionState.action.push({ name: "确定", action: () => back("command"), shortcut: "z" })
    }
  })
}
// 逃跑 / 确定
const back = async (mode: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: mode, command: "back" }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ""
  })
}
// 切换武器
const changeWeapon = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: "revcombat", command: "changewep" }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog

    const attackType = gameState?.playerState?.attackType
    // 第一攻击方式
    actionState.action = [
      {
        name: attackType?.type1.name || "",
        action: () => attack(attackType?.type1.id || ""),
        shortcut: "z",
      },
    ]
    // 第二攻击方式
    if (attackType?.type2) {
      actionState.action.push({
        name: attackType.type2.name,
        action: () => attack(attackType?.type2?.id || ""),
      })
    }
    // 换手
    actionState.action.push({ name: "切换", action: () => changeWeapon(), shortcut: "c" })
    // 技能
    if (state.value?.enemy?.battleSkills) {
      state.value.enemy.battleSkills.forEach((item: any) => {
        actionState.action.push({
          name: item.title,
          action: () => useSkill(item.key),
          active: item.unlock,
          desc: item.desc,
        })
      })
    }
    // 查看敌方技能
    if (state.value?.enemy?.skill) {
      actionState.action.push({
        name: "查看敌方技能",
        action: () => enemySkill(),
      })
    }
    // 润了
    actionState.action.push({ name: "逃跑", action: () => back("revcombat"), shortcut: "x" })
  })
}
// 拾取物品相关
const selectItemKey = ref("")
const selectItem = (item: any) => {
  selectItemKey.value = item.key
  if (actionState.action[0].name.includes("拾取")) {
    actionState.action[0].name = "拾取 " + item.name
    actionState.action[0].action = () => corpseAction(item.key)
  } else {
    actionState.action.unshift({
      name: "拾取 " + item.name,
      action: () => corpseAction(item.key),
    })
  }
}
const corpseAction = async (key: string) => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: "corpse", command: key }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    gameState.drawerType = ""
  })
}

// 查看敌方技能
const enemySkill = () => {
  showDialog.value = true
}
const isMobile = inject('isMobile')
</script>
<template>
  <h1 class="text-primary text-xl font-bold tracking-wide mb-1">
    {{ state?.enemy?.battleState }}
  </h1>
  <div v-if="state?.enemy" class="flex items-end <md:(flex-col items-center)">
    <div class="flex flex-col items-center">
      <!-- 战斗日志 -->
      <div class="mb-1" v-html="state?.actionLog"></div>
      <!-- 敌方信息 -->
      <div class="flex">
        <img
          v-if="state.enemy.hasBigAvatar && !isMobile"
          class="h-49 rounded mr-0.25"
          :class="state.battleState === '发现尸体' && ' filter grayscale-80'"
          :src="`https://llx.life/works/dts/img/avatar/${state.enemy.avatar}`"
        />
        <div class="<md:w-[calc(100vw-1.5rem)]">
          <div class="flex flex-wrap <md:(justify-end relative)">
            <img
              v-if="state.enemy.hasBigAvatar && isMobile"
              class="rounded m-0.25 absolute left-0 w-[calc(25%-0.125rem)] h-[calc(100%-0.125rem)] object-cover"
              :class="state.battleState === '发现尸体' && ' filter grayscale-80'"
              :src="`https://llx.life/works/dts/img/avatar/${state.enemy.avatar}`"
            />
            <Card :title="state.enemy.type" :length="state.enemy.hasBigAvatar && isMobile ? 2 : 3">
                <div class="flex w-full">
                  <img
                    v-if="!state.enemy.hasBigAvatar"
                    class="absolute object-cover h-full rounded"
                    :class="
                      state.battleState === '发现尸体' && ' filter grayscale-80'
                    "
                    :src="`https://llx.life/works/dts/img/avatar/${state.enemy.avatar}`"
                  />
                  <div class="m-auto px-1 relative w-full flex flex-col" :class="state.enemy.hasBigAvatar ? 'items-center' : 'items-end'">
                    <p class="truncate tracking-wide bg-primaryContainer/80 text-onPrimaryContainer w-max px-1 rounded">{{ state.enemy.name }}</p>
                      <p class="text-xs mt-1 px-1 opacity-80">{{ state.enemy.title }}</p>
                      <p v-if="state.enemy.rp" class="text-xs mt-1 px-1 opacity-80">
                        报应点数 {{ state.enemy.rp }}
                      </p>
                  </div>
                </div>
            </Card>
            <Card title="等级">
                <div class="m-auto text-center">
                  <p class="text-2xl">{{ state.enemy.level }}</p>
                </div>
            </Card>
            <!-- 生命 -->
            <Card title="体征" :length="state.enemy.hasBigAvatar && isMobile ? 2 : 3">
              <p v-if="state.battleState === '发现尸体'" class="font-bold m-auto text-rose-600">已经死亡</p>
              <div v-else class="my-auto mx-2">
                <p><span class="font-bold mr-2">生命</span><span v-html="state.enemy.hp"></span></p>
                <p><span class="font-bold mr-2">体力</span><span v-html="state.enemy.mp"></span></p>
                <p><span class="font-bold mr-2">受伤部位</span><span v-html="state.enemy.hurt"></span></p>
              </div>
            </Card>
            <!-- 怒气 -->
            <Card title="怒气">
                <div class="m-auto text-center">
                  <p v-html="state.enemy.rage"></p>
                </div>
            </Card>
          </div>
          <div class="flex flex-wrap">
            <!-- 基础姿态 -->
            <Card title="基础姿态" :length="isMobile ? 1 : 2">
              <div class="m-auto text-center">
                <p v-html="state.enemy.tactic"></p>
              </div>
            </Card>
            <!-- 应战策略 -->
            <Card title="应战策略" :length="isMobile ? 1 : 2">
              <div class="m-auto text-center">
                <p v-html="state.enemy.pose"></p>
              </div>
            </Card>
            <!-- 武器 -->
            <Card :length="isMobile ? 2 : 4" :title="state.enemy.weaponType">
              <div class="flex w-full p-1 items-center text-sm">
                <div class="flex flex-col flex-1 h-full justify-between">
                  <div class="ml-0.5">
                    <p v-html="state.enemy.weapon"></p>
                  </div>
                  <p class="space-x-1 mb-0.5 text-xs">
                    <span
                      class="bg-surfaceContainerHighest rounded px-1.5 py-0.5"
                      >品质 {{ state.enemy.attack }}</span
                    >
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <!-- 掉落物品信息 -->
    <div v-if="state?.battleState === '发现尸体'" class="ml-1 <md:(ml-0 mt-1)">
      <p class="mb-1 <md:text-center">想要从尸体上拾取什么？</p>
      <div class="rounded overflow-hidden">
        <p
          v-for="(item, key) in state?.enemy?.items"
          @click="selectItem(item)"
          :class="selectItemKey == item.key && '!bg-primaryContainer'"
          class="bg-surfaceContainer px-2.5 py-1 cursor-pointer transition"
        >
          <span>
            <span class="text-primary" v-if="item.type">
              [<span class="inline-flex" v-html="item.type"></span>]
            </span>
            <span class="inline-block" v-html="item.name"></span>
            <template v-if="item.type">
              / {{ item.quality }} / {{ item.durability }}
            </template>
            <template v-if="item.props">
              / <span class="inline-flex" v-html="item.props"></span>
            </template>
          </span>
        </p>
      </div>
    </div>
  </div>
  <!-- 战斗喊话 -->
  <template v-if="state?.battleState === '发现敌人'">
    <p class="m-1">向对手大喊：</p>
    <input
      v-model="message"
      class="p-1 text-onSurfaceVariant bg-surfaceContainerHighest rounded text-center"
      type="text"
    />
  </template>
  <div class="mt-1">
    <p>现在想要做什么？</p>
  </div>
  <Teleport to="body">
    <div
      v-if="state?.enemy?.skill"
      class="fixed w-screen h-screen top-0 bg-black/40 z-1 shadow flex transition opacity-0 pointer-events-none"
      :class="showDialog && '!opacity-100 !pointer-events-auto'"
      @click="showDialog = false"
    >
      <div
        class="crafting craft-dialog text-onSurface bg-surfaceContainer text-sm border-2 border-outline h-max max-w-300 m-auto p-1 rounded"
      >
        <div class="p-1">
          <p>
            以下是<span class="yellow">{{ state.enemy.name }}</span
            >的技能列表。
          </p>
          <p>
            请注意描述文字中的<span class="yellow">“你”</span>指代的是这个对象。
          </p>
        </div>
        <div class="max-h-150 overflow-y-auto overscroll-contain">
          <div
            class="bg-surfaceContainerHigh m-1 rounded-sm overflow-hidden"
            v-for="item in state?.enemy?.skill"
          >
            <div
              class="bg-surfaceContainerHighest px-2 py-1 flex justify-between items-center"
            >
              <span>{{ item.name }}</span>
            </div>
            <div class="relative group">
              <div
                v-if="item.desc"
                class="skill-desc p-2"
                v-html="item.desc"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
