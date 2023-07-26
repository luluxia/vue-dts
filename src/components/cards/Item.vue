<script lang="ts" setup>
import type { Item } from '../../types/interface'
defineProps<{ item: Item }>()
</script>

<template>
  <template v-if="item.name">
    <div class="flex w-full p-1 items-center text-onSurface text-sm">
      <!-- <div class="w-12 h-full rounded bg-zinc-900/50 mr-2 flex">
        <img class="m-auto" src="img/weapon1.png" alt=""/>
      </div> -->
      <div class="flex flex-col flex-1 h-full justify-between w-full">
        <div class="ml-0.5">
          <p class="text-onSurface truncate" v-html="item.name"></p>
          <p class="opacity-80" v-html="item.props"></p>
        </div>
        <p class="space-x-0.5 mb-0.5 text-xs">
          <span class="text-onSurface bg-surfaceContainerHighest rounded-sm px-1.5 py-0.5">品质 {{item.quality}}</span>
          <span class="text-onSurface bg-surfaceContainerHighest rounded-sm px-1.5 py-0.5">耐久 {{item.durability}}</span>
        </p>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="m-auto pointer-events-none">
      <p class="text-xl opacity-50">{{item.type}}</p>
    </div>
  </template>
</template>