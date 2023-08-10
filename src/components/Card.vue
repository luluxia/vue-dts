<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  length: {
    type: Number,
    default: 1,
  },
  width: {
    type: Number,
    default: 15,
  }
})
</script>
<template>
  <div
    class="
      card relative min-h-24 flex flex-col m-0.25 rounded group transition overflow-hidden
      bg-surfaceContainerHigh/50 text-onSurface
    "
    :class="`w-${length * width + length - 0.5} <sm:w-[calc(${length * 25}%-0.125rem)]`"
  >
    <div class="absolute w-full h-full rounded pointer-events-none transition z-1 group-hover:(ring-2 ring-inset ring-primary)"></div>
    <p
      v-if="title"
      class="
        text-xs tracking-wider min-h-6 flex items-center px-2 font-bold
        bg-gradient-to-r from-primaryContainer text-onPrimaryContainer opacity-80
      "
      v-html="title"
    ></p>
    <div class="w-full h-full flex flex-1 relative">
      <slot></slot>
    </div>
  </div>
</template>