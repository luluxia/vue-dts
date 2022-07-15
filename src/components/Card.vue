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
    class="h-28 bg-zinc-700 border-zinc-500 border-2 flex flex-col text-zinc-300 m-0.5"
    :class="`w-${length * 18 + length - 1}`"
  >
    <p class="p-1 bg-zinc-600 text-xs font-bold">{{title}}</p>
    <div class="w-full h-full flex relative">
      <slot></slot>
    </div>
  </div>
</template>