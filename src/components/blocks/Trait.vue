<!-- 码语行人 -->
<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from "vue"
import { command } from "../../utils/api"
import type { GameState, ActionState } from "../../types/interface"
const gameState = inject<GameState>("state") as GameState
const actionState = inject<ActionState>("actionState") as ActionState
onMounted(() => {
  actionState.action = [{ name: "放弃", action: () => back() }]
})
// 选择的物品
const item = computed(() => {
  return gameState.playerState?.bag[gameState.useItemKey as string]
})
// 可插入的物品列表
const list = computed(() => {
  if (gameState.playerState) {
    let items: any[] = []
    Object.keys(gameState.playerState.bag).forEach((key, index) => {
      const target = gameState.playerState?.bag[key]
      if (
        target &&
        key != gameState.useItemKey &&
        (target.typeID?.indexOf("D") === 0 ||
          target.typeID?.indexOf("W") === 0 ||
          target.typeID?.indexOf("🥚") === 0)
      ) {
        items.push({
          key,
          item: gameState.playerState?.bag[key],
        })
      }
    })
    return items
  }
})
const traitState = reactive({
  selectTrait: "",
  selectItemKey: "",
})
const selectTrait = (trait: string) => {
  traitState.selectTrait = trait
  actionState.action = [
    { name: "提取", action: () => extract() },
    { name: "放弃", action: () => back() },
  ]
}
const selectItem = (item: any) => {
  traitState.selectItemKey = item.key
  actionState.action = [
    { name: "插入", action: () => add() },
    { name: "放弃", action: () => back() },
  ]
}
const back = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({ mode: "itemmain", command: "menu" }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ""
    }
  })
}
// 提取代码片段
const extract = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: "command",
    command: "special",
    sp_cmd: "sp_extract_trait_selected",
    choice: traitState.selectTrait + gameState.useItemKey?.replace('item', ''),
  }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ""
    }
  })
}
// 插入代码片段
const add = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await command({
    mode: "command",
    command: "special",
    sp_cmd: "sp_add_trait_selected",
    choice: gameState.useItemKey?.replace('item', ''),
    choice2: traitState.selectItemKey?.replace('item', ''),
  }).then((res) => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res as any
    gameState.playerState = data.playerState
    gameState.searchState = data.searchState
    gameState.actionLog = data.actionLog
    if (!data.searchState.findItem) {
      gameState.drawerType = ""
    }
  })
}
</script>

<template>
  <template v-if="item?.typeID?.indexOf('🥚') !== 0">
    <h1 class="text-primary text-xl font-bold tracking-wide mb-1">
      提取「🥚」
    </h1>
    <div class="mb-1 text-center">
      <div class="space-y-1 text-primary">
        <p class="glitchb">／＊</p>
        <p>“把握状况点句号，注释此数后人晓。<br>此乃物品复制术。叮叮咚咚实现了！”</p>
        <p>“然则有基必有础，研究物品颇清楚。<br>物品均有三特性，效果耐久与属性。”</p>
        <p>“有时名称也重要，这里言灵不得了。<br>继续研究更耗时，在此记下自己晓！”</p>
        <p>“进行提取需体力，然而NPC管不了。<br>如有玩家获此术，他们就得纠结啦。”</p>
        <p>“耐久效果倒好说，该是多少烧多少。<br>各路属性他方面，越强属性价格高。”</p>
        <p>“乐子便是这样了，不知如雪满意否？”</p>
        <p class="glitchb">＊／</p>
      </div>
      <p>你想提取 <span v-html="item?.name"></span> 的什么要素？</p>
    </div>
    <div class="flex justify-center flex-wrap mb-1">
      <p
        @click="selectTrait('itm')"
        :class="traitState.selectTrait === 'itm' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span class="text-onSurfaceVariant">[名称] </span>
        <span class="inline-block" v-html="item?.name"></span>
      </p>
      <p
        @click="selectTrait('itme')"
        :class="traitState.selectTrait === 'itme' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span class="text-onSurfaceVariant">[品质] </span>
        <span class="inline-block" v-html="item?.quality"></span>
      </p>
      <p
        @click="selectTrait('itms')"
        :class="traitState.selectTrait === 'itms' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span class="text-onSurfaceVariant">[耐久] </span>
        <span class="inline-block" v-html="item?.durability"></span>
      </p>
      <p
        @click="selectTrait('itmsk')"
        :class="traitState.selectTrait === 'itmsk' && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
        v-if="item?.props"
      >
        <span class="text-onSurfaceVariant">[属性] </span>
        <span class="inline-block" v-html="item?.props"></span>
      </p>
    </div>
  </template>
  <template v-else>
    <h1 class="text-primary text-xl font-bold tracking-wide mb-1">
      插入「🥚」
    </h1>
    <div class="mb-1 text-center">
      <div class="space-y-1 text-primary">
        <p class="glitchb">／＊</p>
        <p>“送佛到西点句号，注释此数后人晓。<br>此乃物品复制术。叮叮咚咚实现了！”</p>
        <p>“代码片段能组合，一加一便合为一，<br>组合无需付资源，因其已于提取消~”</p>
        <p>“但需谨记别贪心，自己不能合自己，<br>怎么样都无意义，尝试也是空一地！”</p>
        <p>“如挑物品与代码，两者便可合一体，<br>需要消费50怒，但NPC自然没问题！”</p>
        <p>“合体赚取强物品，能加耐久与效品，<br>更能附加多属性，产生不可能之礼。”</p>
        <p>“乐子便是这样了，不知如雪满意否？”</p>
        <p class="glitchb">＊／</p>
      </div>
      <p>你的脑海中奇怪地闪过了以上内容。</p>
      <p>你想将 <span v-html="item?.name"></span> 插入哪个物品？</p>
    </div>
    <div class="flex justify-center flex-wrap mb-1">
      <p
        v-for="item in list"
        @click="selectItem(item)"
        :class="traitState.selectItemKey === item.key && 'ring-2 ring-outline'"
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 cursor-pointer transition"
      >
        <span v-html="item.item.name"></span>
      </p>
      <p
        class="bg-surfaceContainer px-2.5 py-1 rounded-sm mx-1 opacity-50"
        v-if="!list?.length"
      >
        包裹中没有可插入代码片段的物品
      </p>
    </div>
  </template>
</template>
