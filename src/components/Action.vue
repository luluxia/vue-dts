<script lang="ts" setup>
import { inject, onMounted, watch } from 'vue'
import ItemBag from './ItemBag.vue'
import { command } from '../utils/api'
import { transitionHelper } from '../utils/tools'

import type { GameState, ActionState } from '../types/interface'

const state = inject<GameState>('state', {
  drawerType: '',
  loading: false,
})
// 行动卡片
const actionState = inject<ActionState>('actionState') as ActionState
onMounted(() => {
  actionState.action = [
    // { name: '探索', action: () => search() },
    { name: '地图', action: () => map() },
    { name: '战术', action: () => tactics() },
    { name: '合成', action: () => crafting(), id: 'crafting' },
    { name: '元素口袋', action: () => element(), id: 'element' },
    { name: '整理', action: () => arrange(), desc: '交换道具位置，或合并可堆叠道具' },
    { name: '歌唱', action: () => song(), desc: 'x', id: 'song' },
    { name: '睡眠', action: () => rest('rest1'), desc: '进入睡眠状态，随时间缓慢恢复体力' },
    { name: '治疗', action: () => rest('rest2'), desc: '进入治疗状态，随时间缓慢恢复生命' },
    { name: '静养', action: () => rest('rest3'), desc: '进入静养状态，随时间缓慢恢复生命与体力，同时可以积攒怒气', id: 'rest3' },
    { name: '队伍', action: () => team() },
    { name: '安全箱', action: () => depot(), desc: '向安全箱中存入或取出道具', id: 'depot' },
    { name: '商店', action: () => shop(), id: 'shop' },
    { name: '带电', action: () => customize(), desc: '消耗一枚电池，为武器或陷阱附加电击属性', id: 'electric' },
    { name: '淬毒', action: () => customize(), desc: '消耗一份毒药，为武器或陷阱附加带毒属性', id: 'poison' },
    { name: '检查毒物', action: () => checkPoison(), desc: '选择一份背包中的补给品，检查其是否带毒', id: 'poison' },
    { name: '技能', action: () => skill() },
    { name: '佣兵', action: () => mercenary(), id: 'mercenary' },
    { name: '控制面板', action: () => controlPanel(), id: 'control' },
  ]
  if (state.searchState && state.searchState.findEnemy) {
    state.drawerType = 'find-enemy'
  } else if (state.searchState && state.searchState.findItem) {
    state.drawerType = 'find-item'
  } else if (state.searchState && state.searchState.findTeam) {
    state.drawerType = 'find-team'
  }
})
// 恢复选项
watch(() => state.drawerType, type => {
  if (type === '') {
    actionState.action = [
      // { name: '探索', action: () => search() },
      { name: '地图', action: () => map() },
      { name: '战术', action: () => tactics() },
      { name: '合成', action: () => crafting(), id: 'crafting' },
      { name: '元素口袋', action: () => element(), id: 'element' },
      { name: '整理', action: () => arrange(), desc: '交换道具位置，或合并可堆叠道具' },
      { name: '歌唱', action: () => song(), desc: 'x', id: 'song' },
      { name: '睡眠', action: () => rest('rest1'), desc: '进入睡眠状态，随时间缓慢恢复体力' },
      { name: '治疗', action: () => rest('rest2'), desc: '进入治疗状态，随时间缓慢恢复生命' },
      { name: '静养', action: () => rest('rest3'), desc: '进入静养状态，随时间缓慢恢复生命与体力，同时可以积攒怒气', id: 'rest3' },
      { name: '队伍', action: () => team() },
      { name: '安全箱', action: () => depot(), desc: '向安全箱中存入或取出道具', id: 'depot' },
      { name: '商店', action: () => shop(), id: 'shop' },
      { name: '带电', action: () => customize(), desc: '消耗一枚电池，为武器或陷阱附加电击属性', id: 'electric' },
      { name: '淬毒', action: () => customize(), desc: '消耗一份毒药，为武器或陷阱附加带毒属性', id: 'poison' },
      { name: '检查毒物', action: () => checkPoison(), desc: '选择一份背包中的补给品，检查其是否带毒', id: 'poison' },
      { name: '技能', action: () => skill() },
      { name: '佣兵', action: () => mercenary(), id: 'mercenary' },
      { name: '控制面板', action: () => controlPanel(), id: 'control' },
    ]
  }
})
// 判断探索结果
watch(() => state.searchState, (val) => {
  if (val && val.findEnemy) {
    state.drawerType = 'find-enemy'
  } else if (val && val.findItem) {
    state.drawerType = 'find-item'
  } else if (val && val.findTeam) {
    state.drawerType = 'find-team'
  }
})
// 探索
const search = async () => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({mode: 'command', command: 'search'}).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.searchState = data.searchState
    state.actionLog = data.actionLog
    if (data.searchState.findEnemy) {
      // 发现敌人
      state.drawerType = 'find-enemy'
    } else if (data.searchState.findItem) {
      // 发现物品
      state.drawerType = 'find-item'
    }
  })
}
// 地图
const map = () => {
  if (state.drawerType !== 'map') {
    actionState.oldType = state.drawerType
    actionState.action.map(action => {
      action.name != '地图' && (action.active = false)
    })
    state.drawerType = 'map'
  } else {
    state.drawerType = actionState.oldType
  }
}
// 战术
const tactics = () => {
  if (state.drawerType !== 'tactics') {
    actionState.oldType = state.drawerType
    actionState.action.map(action => {
      action.name != '战术' && (action.active = false)
    })
    state.drawerType = 'tactics'
  } else {
    state.drawerType = actionState.oldType
  }
}
// 合成
const crafting = async () => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({mode: 'command', command: 'itemmain', itemcmd: 'itemmix'}).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    state.drawerType = 'crafting'
  })
}
// 整理
const arrange = () => {
  state.drawerType = 'arrange'
}
// 睡眠/治疗
const rest = async (type: string) => {
  // 搜索指令
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: type }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    state.drawerType = 'rest'
  })
}
// 队伍
const team = () => {
  transitionHelper({
    updateDOM() {
      state.drawerType = 'team'
    }
  })
}
// 技能
const skill = () => {
  transitionHelper({
    updateDOM() {
      if (state.drawerType !== 'skill') {
        actionState.oldType = state.drawerType
        actionState.action.map(action => {
          action.name != '技能' && (action.active = false)
        })
        state.drawerType = 'skill'
      } else {
        state.drawerType = actionState.oldType
      }
    }
  })
}
// 商店
const shop = async () => {
  transitionHelper({
    async updateDOM() {
      if (state.drawerType !== 'shop') {
        actionState.oldType = state.drawerType
        actionState.action.map(action => {
          action.name != '商店' && (action.active = false)
        })
        let waitTimer = setTimeout(() => {
          state.loading = true
        }, 200)
        await command({ mode: 'special', command: 'shop1' }).then(res => {
          window.clearTimeout(waitTimer)
          state.loading = false
          const data = res as any
          state.playerState = data.playerState
          state.actionLog = data.actionLog
          state.drawerType = 'shop'
        })
      } else {
        state.drawerType = actionState.oldType
      }
    }
  })
}
// 安全箱
const depot = async () => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: 'special', sp_cmd: 'sp_depot' }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
    state.drawerType = 'depot'
  })
}
// 歌唱
const song = async () => {
  let waitTimer = setTimeout(() => {
    state.loading = true
  }, 200)
  await command({ mode: 'command', command: 'song' }).then(res => {
    window.clearTimeout(waitTimer)
    state.loading = false
    const data = res as any
    state.playerState = data.playerState
    state.actionLog = data.actionLog
  })
}
// 改造（带电/淬毒）
const customize = () => {
  state.drawerType = 'customize'
}
// 检查毒物
const checkPoison = () => {
  state.drawerType = 'check-poison'
}
// 佣兵
const mercenary = () => {
  transitionHelper({
    updateDOM() {
      if (state.drawerType !== 'mercenary') {
        actionState.oldType = state.drawerType
        actionState.action.map(action => {
          action.name != '佣兵' && (action.active = false)
        })
        state.drawerType = 'mercenary'
      } else {
        state.drawerType = actionState.oldType
      }
    }
  })
}
// 元素口袋
const element = () => {
  transitionHelper({
    updateDOM() {
      state.drawerType = 'element'
    }
  })
}
// 控制面板
const controlPanel = () => {
  transitionHelper({
    updateDOM() {
      state.drawerType = 'control-panel'
    }
  })
}

</script>
<template>
  <div class="actions fixed flex w-screen bottom-0 z-1">
    <div class="mb-4 mx-auto">
      <TransitionGroup
        name="list"
        tag="div"
        class="flex flex-wrap justify-center rounded mx-4 px-2 border-2 border-primary/20 bg-primaryContainer/95 text-onPrimaryContainer"
      >
        <!-- 背包 -->
        <div
          v-if="state.drawerType === '' && state.playerState?.hp?.nowHp && state.playerState.hp.nowHp > 0"
          class="group transition-opacity" key="itemBag"
        >
          <ItemBag/>
        </div>
        <!-- 行动 -->
        <div v-for="(item, index) in actionState.action" class="group transition-opacity" :key="item.name + index">
          <!-- 禁用项 -->
          <div v-if="item.active === false" class="relative flex justify-center cursor-default">
            <!-- 悬浮 -->
            <div v-if="item.desc" class="absolute bottom-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100)">
              <div class="bg-surfaceContainerHigh text-onSurface border-2 border-outline rounded w-max p-2 text-sm">
                <template v-if="item.id === 'song'">
                  {{ `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` }}
                </template>
                <div v-html="item.desc" v-else>
                </div>
              </div>
            </div>
            <div
              class="opacity-50 px-3 py-2"
              :class="item.id && !state.playerState?.canAction?.[item.id as any] ? 'hidden' : ''"
            >
              <p class="m-auto">
                <span class="inline-flex" v-html="item.name"></span>
              </p>
            </div>
          </div>
          <!-- 非禁用项 -->
          <div
            v-else
            class="relative flex justify-center cursor-pointer top-0 select-none transform transition-all group-hover:(-top-1)"
            :class="state.loading && 'opacity-50 pointer-events-none'"
            @click="() => {item.action()}"
          >
            <!-- 悬浮 -->
            <div v-if="item.desc" class="absolute bottom-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100)">
              <div class="bg-surfaceContainerHigh text-onSurface border-2 border-outline rounded w-max p-2 text-sm">
                <template v-if="item.id === 'song'">
                  {{ `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` }}
                </template>
                <div v-html="item.desc" v-else>
                </div>
              </div>
            </div>
            <div
              class="px-3 py-2"
              :class="item.id && !state.playerState?.canAction?.[item.id as any] ? 'hidden' : ''"
            >
              <p class="m-auto">
                <span class="inline-flex" v-html="item.name"></span>
                <span
                  v-if="item.name === '技能'"
                  class="text-sm"
                  :class="state.playerState && state.playerState?.skillPoint == 0 && 'opacity-60'"
                > | 技能点 {{ state.playerState?.skillPoint }}</span>
              </p>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.list-leave-to {
  opacity: 0;
}
.list-move.list-leave-to {
  transition: none;
}
.list-leave-active {
  display: none;
}
.actions {
  view-transition-name: actions;
}
</style>