<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
const state = reactive({
  time: new Date().toLocaleString()
})
setInterval(() => {
  state.time = new Date().toLocaleString()
}, 1000)
</script>

<template>
<div class="m-auto">
  <p class="text-xl">{{state.time}}</p>
</div>
</template>