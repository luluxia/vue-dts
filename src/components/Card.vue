<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 1,
  }
})
</script>
<template>
  <div
    class="h-28 bg-zinc-700/50 border-zinc-500/50 rounded-sm overflow-hidden flex flex-col text-zinc-300 m-0.5"
    :class="`w-${length * 18 + length - 1}`"
  >
    <p class="p-1.5 bg-zinc-500/50 text-xs text-zinc-100">{{title}}</p>
    <div class="w-full h-full flex relative">
      <slot></slot>
    </div>
  </div>
</template>