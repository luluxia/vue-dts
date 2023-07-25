<script lang="ts" setup>
import { inject } from 'vue'
import type { GameState } from '../types/interface'
const state = inject('state', {
  loading: true,
}) as GameState
</script>
<template>
  <div v-if="state.loading" class="fixed w-screen h-screen flex top-0 z-9999 bg-black/10">
    <div class="m-auto text-center">
      <div class="loading"></div>
      <p class="text-sm mt-3 text-primary">少女祈祷中</p>
    </div>
  </div>
</template>
<style>
@keyframes rotationBreak {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.loading {
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;
}
.loading::after, .loading::before {
  content: "";
  width: 48px;
  height: 48px;
  border: 2px solid rgba(var(--md-sys-color-on-primary), 1);
  position: absolute;
  left: 0;
  top: 0;
  animation: rotationBreak 3s ease-in-out infinite alternate;
}
.loading::after {
  border-color: rgba(var(--md-sys-color-primary), 1);
  animation-direction: alternate-reverse;
}
</style>