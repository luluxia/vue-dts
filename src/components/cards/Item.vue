<script lang="ts" setup>
import type { Item } from '../../types/interface'
defineProps<{item: Item, type: 'equipment' | 'bag'}>()
</script>

<template>
  <template v-if="item.name">
    <div class="flex w-full p-2 items-center">
      <div class="w-12 h-full rounded bg-zinc-900/50 mr-2 flex">
        <img class="m-auto" src="img/weapon1.png" alt=""/>
      </div>
      <div class="flex flex-col flex-1 h-full justify-between">
        <div class="ml-0.5">
          <p class="font-bold text-sm">{{item.name}}</p>
          <p class="text-zinc-400 text-sm">{{item.props}}</p>
        </div>
        <p class="text-sm space-x-1 mt-1">
          <span class="text-blue-300 bg-zinc-900/50 rounded px-1.5 py-0.5">品质 {{item.quality}}</span>
          <span class="text-green-400 bg-zinc-900/50 rounded px-1.5 py-0.5">耐久 {{item.durability}}</span>
        </p>
      </div>
    </div>
    <div class="absolute right-1 bottom-1 space-y-1 transition opacity-0 group-hover:(opacity-100)">
      <p v-if="type == 'equipment'" class="m-auto text-xs px-3 py-1 bg-zinc-600 rounded">卸下</p>
      <p v-if="type == 'bag'" class="m-auto text-xs px-3 py-1 bg-zinc-600 rounded">快捷</p>
      <p class="m-auto text-xs px-3 py-1 bg-rose-800 rounded">丢弃</p>
    </div>
  </template>
  <template v-else>
    <div class="m-auto">
      <p class="text-xl opacity-50">{{item.type}}</p>
    </div>
  </template>
</template>