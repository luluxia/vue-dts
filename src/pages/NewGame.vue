<script lang="ts" setup>
import Card from '../components/Card.vue'
</script>
<template>
  <div class="w-screen-xl mx-auto flex space-x-5">
    <div class="flex-1">
      <div>
        <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
          状态<span class="text-base -ml-1 opacity-10">STATUS</span>
        </h1>
        <Card title="参战者">
          test
        </Card>
      </div>
    </div>
    <div class="flex-1">
      <h1 class="p-1 text-zinc-400 text-2xl font-bold border-b-zinc-800 border-b-2 border-dashed mb-2">
        讯息<span class="text-base -ml-1 opacity-10">STATUS</span>
      </h1>
    </div>
  </div>
</template>