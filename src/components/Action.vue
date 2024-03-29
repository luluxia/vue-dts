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
  state.drawerType = 'map'
}
// 战术
const tactics = () => {
  state.drawerType = 'tactics'
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
  state.drawerType = 'team'
}
// 技能
const skill = () => {
  state.drawerType = 'skill'
}
// 商店
const shop = async () => {
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
  state.drawerType = 'mercenary'
}
// 元素口袋
const element = () => {
  state.drawerType = 'element'
}
// 控制面板
const controlPanel = () => {
  state.drawerType = 'control-panel'
}
// 键控
document.addEventListener('keydown', (e) => {
  actionState.action.find(item => item.shortcut === e.key && item.active !== false)?.action()
})

</script>
<template>
  <div class="actions m-auto z-1">
    <div class="mb-4 mx-auto flex <md:m-0">
      <TransitionGroup
        name="list"
        tag="div"
        class="
          relative flex flex-wrap justify-center rounded mx-2 px-2 border-2 border-primary/20 bg-primaryContainer/95 text-onPrimaryContainer
          <md:(px-0 m-0 border-b-0 border-l-0 border-r-0 rounded-none w-screen py-1)
        "
      >
        <!-- 背包 -->
        <div
          v-if="state.drawerType === '' && state.playerState?.hp?.nowHp && state.playerState.hp.nowHp > 0"
          class="group transition-opacity <md:(!transition-none)" key="itemBag"
        >
          <ItemBag/>
        </div>
        <!-- 行动 -->
        <div v-for="(item, index) in actionState.action" class="group transition-opacity <md:(!transition-none)" :key="item.name + index">
          <!-- 禁用项 -->
          <div v-if="item.active === false" class="relative flex justify-center cursor-default">
            <!-- 悬浮 -->
            <!-- <div v-if="item.desc" class="absolute bottom-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100) <md:hidden">
              <div class="bg-surfaceContainerHigh text-onSurface border-2 border-outline rounded w-max p-2 text-sm">
                <template v-if="item.id === 'song'">
                  {{ `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` }}
                </template>
                <div v-html="item.desc" v-else>
                </div>
              </div>
            </div> -->
            <div
              class="opacity-50 px-3 py-2"
              :class="item.id && !state.playerState?.canAction?.[item.id as any] ? 'hidden' : ''"
            >
              <p class="m-auto">
                <span v-if="item.shortcut" class="uppercase <md:hidden">[{{ item.shortcut }}] </span>
                <span
                  class="inline-flex"
                  v-html="item.name"
                  :tooltip="
                    item.id === 'song' ? `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` : item.desc
                  "
                ></span>
              </p>
            </div>
          </div>
          <!-- 非禁用项 -->
          <div
            v-else
            class="relative flex justify-center cursor-pointer top-0 select-none transform transition-all group-hover:(-top-1 <md:top-0)"
            :class="state.loading && 'opacity-50 pointer-events-none'"
            @click="() => {item.action()}"
          >
            <!-- 悬浮 -->
            <!-- <div v-if="item.desc" class="absolute bottom-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100) <md:hidden">
              <div class="bg-surfaceContainerHigh text-onSurface border-2 border-outline rounded w-max p-2 text-sm">
                <template v-if="item.id === 'song'">
                  {{ `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` }}
                </template>
                <div v-html="item.desc" v-else>
                </div>
              </div>
            </div> -->
            <div
              class="px-3 py-2"
              :class="item.id && !state.playerState?.canAction?.[item.id as any] ? 'hidden' : ''"
            >
              <p class="m-auto">
                <span v-if="item.shortcut" class="uppercase <md:hidden">[{{ item.shortcut }}] </span>
                <span
                  class="inline-flex"
                  v-html="item.name"
                  :tooltip="
                    item.id === 'song' ? `消耗${state.playerState?.equipment.accessory.quality}点歌魂歌唱，可能会暴露自己的位置` : item.desc
                  "
                ></span>
                <span
                  v-if="item.name === '技能'"
                  class="text-sm"
                  :class="state.playerState && state.playerState?.skillPoint == 0 && 'opacity-60'"
                > | 技能点 {{ state.playerState?.skillPoint }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- <div
          @mouseenter="state.hideDrawer = true"
          @mouseleave="state.hideDrawer = false"
          key="hideDrawer"
          class="absolute -bottom-0.5 -right-20 h-11 w-11 flex rounded border-2 border-primary/20 bg-primaryContainer/50 text-onPrimaryContainer pointer-events-auto"
        >
          <svg class="stroke-onSurface m-auto" width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/><path d="M42 42L6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="miter"/></svg>
        </div> -->
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