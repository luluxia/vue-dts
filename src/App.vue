<script setup lang="ts">
import HeaderVue from './components/Header.vue'
</script>

<template>
  <HeaderVue/>
  <router-view class="mt-20"></router-view>
</template>

<style>
body {
  background-image: url(/img/bg.png);
}
</style>
