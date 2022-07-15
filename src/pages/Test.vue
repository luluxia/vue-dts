<script lang="ts" setup>
import { reactive } from 'vue'
import Card from '../components/Card.vue'
const test = reactive([1,2,3,4,5])
</script>
<template>
  <div class="text-white">
    <p @click="() => {test.push(test.length + 1)}">add</p>
    <p @click="() => {test.shift()}">remove</p>
    <div class="w-200">
      <TransitionGroup name="list" tag="ul" class="flex m-auto w-max">
        <!-- <li v-for="item in test" :key="item">{{item}}</li> -->
        <Card v-for="item in test" :title="item.toString()" :key="item" />
      </TransitionGroup>
    </div>
  </div>
</template>
<style>

</style>