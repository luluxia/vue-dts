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
    class="h-28 bg-zinc-700/30 border-zinc-500/50 flex flex-col text-zinc-200 m-0.25 transition hover:(ring-2 ring-zinc-500)"
    :class="`w-${length * 18.5 + length - 0.5}`"
  >
    <p v-if="title" class="bg-gradient-to-r from-zinc-500/30 text-xs text-zinc-100 tracking-wider h-10 flex items-center px-2 text-shadow-xl" v-html="title"></p>
    <div class="w-full h-full flex relative">
      <slot></slot>
    </div>
  </div>
</template>