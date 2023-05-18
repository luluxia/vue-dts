import { createRouter, createWebHistory } from 'vue-router'
import GameVue from './pages/Game.vue'
import GameM from './pages/GameM.vue'
import TestVue from './pages/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/game', component: GameVue },
    { path: '/gamem', component: GameM },
    { path: '/test', component: TestVue },
  ]
})

export default router