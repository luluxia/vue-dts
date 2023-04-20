<script lang="ts" setup>
import { inject, onMounted, provide, reactive, ref, watch } from 'vue'
import Card from '../components/Card.vue'
import Semo from './Semo.vue'
import ItemBag from './ItemBag.vue'
import { test, command } from '../utils/api'

import type { GameState, ActionState } from '../types/interface'

const state = inject<GameState>('state', {
  showDrawer: false,
  drawerType: '',
  loading: false,
})
// 行动卡片
const actionState = inject<ActionState>('actionState') as ActionState
onMounted(() => {
  actionState.action = [
    { name: '探索', action: () => search() },
    { name: '地图', action: () => map() },
    { name: '战术', action: () => tactics() },
    { name: '合成', action: () => crafting() },
    // { name: '睡眠', action: () => sleep() },
    // { name: '治疗', action: () => heal() },
    // { name: '战术', action: () => tactics() },
    // { name: '商店', action: () => shop() },
  ]
})
// 首次加载时判断内容
watch(() => state.searchState, (val) => {
  // if (actionState.firstCheck) {
  //   actionState.firstCheck = false
  // } else {
  //   return
  // }
  if (val && val.findEnemy) {
    state.drawerType = 'find-enemy'
  } else if (val && val.findItem) {
    state.drawerType = 'find-item'
  }
})
// 恢复选项
watch(() => state.drawerType, type => {
  if (type === '') {
    actionState.action = [
      { name: '探索', action: () => search() },
      { name: '地图', action: () => map() },
      { name: '战术', action: () => tactics() },
      { name: '合成', action: () => crafting() },
      // { name: '睡眠', action: () => sleep() },
      // { name: '治疗', action: () => heal() },
      // { name: '战术', action: () => tactics() },
      // { name: '商店', action: () => shop() },
    ]
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
// 打开地图
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
  // actionState.action.map(action => {
  //   if (state.showDrawer) {
  //     action.name != '地图' && (action.active = false)
  //   } else {
  //     action.active = true
  //   }
  // })
}
// 打开合成页面
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
// 打开睡眠
const sleep = () => {
  state.drawerType = 'sleep'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '睡眠' && (action.active = false)
    } else {
      action.active = true
    }
  })
}
// 治疗
const heal = () => {
  state.drawerType = 'heal'
  state.showDrawer = !state.showDrawer
  actionState.action.map(action => {
    if (state.showDrawer) {
      action.name != '治疗' && (action.active = false)
    } else {
      action.active = true
    }
  })
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
// 商店
const shop = () => {
  if (state.drawerType != 'shop') {
    state.showDrawer = false
    setTimeout(() => {
      state.showDrawer = true
      state.drawerType = 'shop'
      actionState.action.map(action => {
        if (state.showDrawer) {
          action.name != '商店' && (action.active = false)
        } else {
          action.active = true
        }
      })
    }, 200)
  } else {
    state.showDrawer = !state.showDrawer
    actionState.action.map(action => {
      if (state.showDrawer) {
        action.name != '商店' && (action.active = false)
      } else {
        action.active = true
      }
    })
  }
}

</script>
<template>
  <div class="fixed flex w-screen bottom-0">
    <div class="p-2 mb-4 mx-auto flex flex-col">
      <TransitionGroup name="list" tag="div" class="flex m-auto items-center bg-zinc-700/90 ring-zinc-600 ring-1">
        <!-- 视野 -->
        <div v-if="state.drawerType === ''" class="group transition-opacity" key="semo">
          <Semo/>
        </div>
        <!-- 背包 -->
        <div v-if="state.drawerType === ''" class="group transition-opacity" key="itemBag">
          <ItemBag/>
        </div>
        <!-- 行动 -->
        <div v-for="item in actionState.action" class="group transition-opacity" :key="item.name">
          <!-- 禁用项 -->
          <div v-if="item.active === false" class="cursor-default">
            <!-- 悬浮 -->
            <div v-if="item.desc" class="absolute bottom-0 pb-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100)">
              <div v-html="item.desc" class="bg-zinc-800 border-2 border-zinc-600 rounded w-max space-y-0.5 text-base text-zinc-300 p-2">
              </div>
            </div>
            <div class="text-zinc-500 px-4 py-2">
              <p class="m-auto">{{item.name}}<span v-if="item.desc" class="text-sm ml-0.5 text-zinc-500">[?]</span></p>
            </div>
          </div>
          <!-- 非禁用项 -->
          <div
            v-else
            class="flex justify-center transform transition-all top-0 cursor-pointer relative group-hover:(-top-1)"
            @click="() => {item.action()}"
          >
            <!-- 悬浮 -->
            <div v-if="item.desc" class="absolute bottom-0 pb-12 transition-opacity opacity-0 pointer-events-none group-hover:(opacity-100)">
              <div v-html="item.desc" class="bg-zinc-800 border-2 border-zinc-600 rounded w-max space-y-0.5 text-base text-zinc-300 p-2">
              </div>
            </div>
            <div class="text-zinc-300 px-4 py-2">
              <p class="m-auto">{{item.name}}<span v-if="item.desc" class="text-sm ml-0.5 text-zinc-500">[?]</span></p>
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
  transform: translateY(-30px);
}
.list-leave-to {
  opacity: 0;
}
.list-move.list-leave-to {
  transition: none;
}
.list-leave-active {
  position: absolute;
}
.tippy-box {
  border: 2px solid rgb(255 255 255 / 20%);
  box-shadow: 0 0 2px 2px rgb(0 0 0 / 20%);
  max-width: max-content !important;
  padding: 0.125em;
  background-color: #252528;
}
.tippy-content {
  padding: 0em;
}
</style>