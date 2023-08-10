<script lang="ts" setup>
import { inject, nextTick, onMounted, onUnmounted, provide, reactive, ref, Ref, watch } from 'vue'
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
// import Sidebar from '../components/Sidebar.vue'
import Loading from '../components/Loading.vue'
// 玩家状态组件
import Player from '../components/cards/Player.vue'
import Level from '../components/cards/Level.vue'
import Health from '../components/cards/Health.vue'
// import Hp from '../components/cards/Hp.vue'
// import Mp from '../components/cards/Mp.vue'
import Rage from '../components/cards/Rage.vue'
import SongSoul from '../components/cards/SongSoul.vue'
import Gift from '../components/cards/Gift.vue'
import Tactic from '../components/cards/Tactic.vue'
import Pose from '../components/cards/Pose.vue'
import Horizon from '../components/cards/Horizon.vue'
import Attack from '../components/cards/Attack.vue'
import Defense from '../components/cards/Defense.vue'
import Team from '../components/cards/Team.vue'
import Proficiency from '../components/cards/Proficiency.vue'
// 地点组件
import NowArea from '../components/cards/NowArea.vue'
import Remain from '../components/cards/Remain.vue'
import Passage from '../components/cards/Passage.vue'
import Weather from '../components/cards/Weather.vue'
// 负面效果组件
// import Debuffs from '../components/cards/Debuffs.vue'
// 装备包裹
import Equipment from '../components/Equipment.vue'
import Package from '../components/Package.vue'

import Chat from '../components/Chat.vue'
import News from '../components/News.vue'

// 死亡信息
import Death from '../components/blocks/Death.vue'
// 弹框
import Dialog from '../components/blocks/Dialog.vue'
// 入场手续
import Valid from '../components/blocks/Valid.vue'
// 结局
import End from '../components/blocks/End.vue'
import axios from 'axios'
import tippy from 'tippy.js'
import interact from 'interactjs'
import type { GameState, ActionState } from '../types/interface'
// 游戏状态
const state = reactive<GameState>({ drawerType: '' })
provide('state', state)
// 行动栏状态
const actionState: ActionState = reactive({
  action: [],
  oldType: '',
})
provide('actionState', actionState)
const error = ref('')
const endState = ref({
  title: '',
})
const validState = ref({})
const switchType = ref('news')

onMounted(async () => {
  await axios.get('/old/game.php?is_new=1').then(res => {
    const data = res.data as any
    state.page = data.page
    if (state.page == 'game') {
      state.playerState = data.playerState
      state.searchState = data.searchState
      state.actionLog = data.actionLog
      state.log = data.log
    } else if (state.page == 'end') {
      endState.value = data
    } else if (state.page == 'valid') {
      validState.value = data
    } else if (data.error) {
      error.value = data.error
    }
  })
  /** 移动端 */
  if (isMobile.value && state.playerState?.playerInfo.name) {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
    const y = ref(0)
    interact(document.body)
    .draggable({
      modifiers: [
        interact.modifiers.snapSize({
          targets: [
            interact.snappers.grid({ width: 98, height: 98 })
          ],
          range: Infinity,
        })
      ],
    })
    .on('dragmove', e => {
      const target = y.value + e.dy
      if (target <= 0 && target >= -(mobileCardPage.value.clientHeight - 98)) {
        y.value += e.dy
        mobileCardPage.value.style.transform = `translateY(${y.value}px)`
      }
    })
  }
})

onUnmounted(() => {
  /** 移动端 */
  if (isMobile.value) {
    interact(document.body).unset()
  }
})

watch(() => state.playerState?.isGameOver, async (isGameOver) => {
  if (isGameOver) {
    let waitTimer = setTimeout(() => {
      state.loading = true
    }, 200)
    state.playerState = undefined
    await axios.get('/old/game.php?is_new=1').then(res => {
      window.clearTimeout(waitTimer)
      state.loading = false
      const data = res.data as any
      state.page = data.page
      if (state.page == 'end') {
        endState.value = data
      }
    })
  }
})

watch(() => state.playerState, (playerState) => {
  if (playerState == null) {
    location.reload()
  }
})

// 刷新tooltip
watch(() => {
  return {
    playerState: state.playerState,
    drawerType: state.drawerType,
  }
 }, () => {
  nextTick(() => {
    const tooltips = document.querySelectorAll('span[tooltip], span[tooltip2]')
    tooltips.forEach((el: any) => {
      if (el._tippy) {
        el._tippy.setContent(el.getAttribute('tooltip') || el.getAttribute('tooltip2') || '')
      } else {
        tippy(el, {
          arrow: false,
          content: (el) => {
            const content = el.getAttribute('tooltip') || el.getAttribute('tooltip2') || ''
            return content as string
          },
          theme: 'tooltip',
          appendTo: () => document.body,
        })
      }
    })
  })
})
/** 移动端 */
const isMobile = inject('isMobile') as Ref<boolean>
const mobileCardPage = ref()
const mobileMenu = [
  { title: '状态', key: 'status' },
  { title: '地点', key: 'area' },
  { title: '包裹', key: 'package' },
  { title: '装备', key: 'equipment' },
  { title: '进行状况', key: 'news' },
  { title: '聊天讯息', key: 'chat' },
]
const nowMobileMenu = ref('status')
const mobileHide = ref(false)
watch(() => state.page, (page) => {
  if (isMobile.value && page === 'game') {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
    const y = ref(0)
    interact(document.body)
    .draggable({
      modifiers: [
        interact.modifiers.snapSize({
          targets: [
            interact.snappers.grid({ width: 98, height: 98 })
          ],
          range: Infinity,
        })
      ],
    })
    .on('dragmove', e => {
      const target = y.value + e.dy
      if (target <= 0 && target >= -(mobileCardPage.value.clientHeight - 98)) {
        y.value += e.dy
        mobileCardPage.value.style.transform = `translateY(${y.value}px)`
      }
    })
  }
})
</script>

<template>
  <div>
    <!-- 加载 -->
    <Transition><Loading/></Transition>
    <!-- 背景 -->
    <div class="fixed w-screen h-screen top-0 pointer-events-none">
      <img
        v-if="state.playerState?.area.nowArea"
        class="background w-full h-full object-cover grayscale"
        :src="`/old/img/location/${state.playerState?.area.nowArea}.jpg`" alt=""
      >
      <img v-else class="w-full h-full object-cover" src="/img/bg.png"/>
    </div>
    <!-- 游戏主界面 -->
    <Transition>
    <div v-if="state.playerState?.playerInfo.name">
      <!-- 游戏卡片 -->
      <div v-if="!isMobile" class="w-screen mx-auto pt-8" :style="{'margin-bottom': (state.drawerHeight || 100) + 20 + 'px'}">
        <div class="flex justify-center mx-5 space-x-2">
          <!-- 左 -->
          <div class="max-w-128 min-w-0 flex-1">
            <div class="w-full">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  <span v-if="switchType == 'news'">进行状况<span class="text-base -ml-1 opacity-10">NEWS</span></span>
                  <span v-if="switchType == 'chat'">聊天讯息<span class="text-base -ml-1 opacity-10">CHAT</span></span>
                </h1>
                <p @click="switchType = switchType == 'news' ? 'chat' : 'news'" class="text-primary cursor-pointer">切换</p>
              </div>
              <News :class="switchType == 'news' ? 'block' : 'hidden'" />
              <Chat :class="switchType == 'chat' ? 'block' : 'hidden'" />
            </div>
          </div>
          <!-- 中 -->
          <div class="space-y-1 w-128">
            <!-- 状态 -->
            <div class="relative w-128">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  状态<span class="text-base -ml-1 opacity-10">STATUS</span>
                </h1>
                <div class="flex space-x-5">
                  <p class="text-primary"><span class="font-bold">击杀数</span> {{ state.playerState?.killNum }}</p>
                  <p v-if="state.playerState?.rp" class="text-primary"><span class="font-bold">报应点数</span> {{ state.playerState?.rp }}</p>
                </div>
              </div>
              <!-- 状态 内容 -->
              <div>
                <div class="flex">
                  <!-- 头像 -->
                  <Card :title="state.playerState?.playerInfo.nick" :length="3">
                    <Player/>
                  </Card>
                  <!-- 等级 -->
                  <Card class="overflow-hidden" title="等级">
                    <Level/>
                  </Card>
                  <!-- 体征 -->
                  <Card class="overflow-hidden" :length="4" title="体征">
                    <Health/>
                  </Card>
                </div>
                <div class="flex">
                  <!-- 基础姿态 -->
                  <Card title="基础姿态" :length="2">
                    <Pose/>
                  </Card>
                  <!-- 应战策略 -->
                  <Card title="应战策略" :length="2">
                    <Tactic/>
                  </Card>
                  <!-- 攻击力 -->
                  <Card title="攻击力" :length="2">
                    <Attack/>
                  </Card>
                  <!-- 防御力 -->
                  <Card title="防御力" :length="2">
                    <Defense/>
                  </Card>
                </div>
                <div class="flex">
                  <!-- 内定称号 -->
                  <Card title="内定称号" :length="2">
                    <Gift/>
                  </Card>
                  <!-- 战术界面 -->
                  <Card title="战术界面" :length="2">
                    <Horizon/>
                  </Card>
                  <!-- 熟练度 -->
                  <Card title="熟练度" :length="4" class="overflow-hidden">
                    <Proficiency type="melee"/>
                  </Card>
                </div>
                <div class="flex">
                  <!-- 队伍 -->
                  <Card title="队伍" :length="2">
                    <Team/>
                  </Card>
                  <!-- 怒气 -->
                  <Card title="怒气" :length="2">
                    <Rage/>
                  </Card>
                  <!-- 歌魂 -->
                  <Card title="歌魂" :length="2">
                    <SongSoul/>
                  </Card>
                </div>
              </div>
            </div>
            <!-- 位置 -->
            <div class="relative w-128">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  地点<span class="text-base -ml-1 opacity-10">AREA</span>
                </h1>
              </div>
              <!-- 位置 内容 -->
              <div class="flex flex-wrap">
                <!-- 当前地点 -->
                <Card title="当前地点" :length="2">
                  <NowArea/>
                </Card>
                <!-- 通行状态 -->
                <Card title="通行状态" :length="2">
                  <Passage/>
                </Card>
                <!-- 剩余人数 -->
                <Card title="剩余人数" :length="2">
                  <Remain/>
                </Card>
                <!-- 天气 -->
                <Card title="天气" :length="2">
                  <Weather/>
                </Card>
              </div>
            </div>
            <!-- 负面效果 -->
            <!-- <div class="relative w-128">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  负面效果<span class="text-base -ml-1 opacity-10">DEBUFF</span>
                </h1>
              </div> -->
              <!-- 负面效果 内容 -->
              <!-- <div class="flex flex-wrap"> -->
                <!-- 负面效果 -->
                <!-- <Debuffs/> -->
              <!-- </div> -->
            <!-- </div> -->
          </div>
          <!-- 右 -->
          <div class="space-y-1 w-128">
            <!-- 包裹 -->
            <div class="relative w-128">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  包裹<span class="text-base -ml-1 opacity-10">PACKAGE</span>
                </h1>
                <p class="text-primary"><span class="font-bold">金钱</span> {{ state.playerState?.money }} 元</p>
              </div>
              <!-- 包裹 内容 -->
              <div v-if="state.playerState" class="flex flex-wrap">
                <Package/>
              </div>
            </div>
            <!-- 装备 -->
            <div class="relative w-128">
              <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
                  装备<span class="text-base -ml-1 opacity-10">EQUIPMENT</span>
                </h1>
              </div>
              <!-- 装备 内容 -->
              <div v-if="state.playerState" class="flex flex-wrap">
                <Equipment/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 移动端页面 -->
      <div v-else class="pt-12 flex flex-col">
        <ul
          class="
            no-scroll-bar flex whitespace-nowrap overflow-x-auto px-3 py-2 space-x-4 z-2
            bg-surfaceContainerHighest text-onSurface
          "
        >
          <li
            v-for="item in mobileMenu"
            @click="nowMobileMenu = item.key"
            :class="nowMobileMenu === item.key && 'font-bold text-primary'"
          >{{ item.title }}</li>
        </ul>
        <div v-if="!['news', 'chat'].includes(nowMobileMenu)" ref="mobileCardPage" class="flex flex-wrap m-1">
          <template v-if="nowMobileMenu === 'status'">
            <!-- 头像 -->
            <Card :title="state.playerState?.playerInfo.nick" :length="2">
              <Player/>
            </Card>
            <!-- 等级 -->
            <Card class="overflow-hidden" title="等级">
              <Level/>
            </Card>
            <!-- 怒气 -->
            <Card title="怒气">
              <Rage/>
            </Card>
            <!-- 体征 -->
            <Card class="overflow-hidden" :length="2" title="体征">
              <Health/>
            </Card>
            <!-- 攻击力 -->
            <Card title="攻击力">
              <Attack/>
            </Card>
            <!-- 防御力 -->
            <Card title="防御力">
              <Defense/>
            </Card>
            <!-- 基础姿态 -->
            <Card title="基础姿态">
              <Pose/>
            </Card>
            <!-- 应战策略 -->
            <Card title="应战策略">
              <Tactic/>
            </Card>
            <!-- 内定称号 -->
            <Card title="内定称号">
              <Gift/>
            </Card>
            <!-- 战术界面 -->
            <Card title="战术界面">
              <Horizon/>
            </Card>
            <!-- 熟练度 -->
            <Card title="熟练度" :length="2" class="overflow-hidden">
              <Proficiency type="melee"/>
            </Card>
            <!-- 队伍 -->
            <Card title="队伍">
              <Team/>
            </Card>
            <!-- 歌魂 -->
            <Card title="歌魂">
              <SongSoul/>
            </Card>
          </template>
          <template v-else-if="nowMobileMenu === 'area'">
            <!-- 当前地点 -->
            <Card title="当前地点" :length="2">
              <NowArea/>
            </Card>
            <!-- 通行状态 -->
            <Card title="通行状态" :length="2">
              <Passage/>
            </Card>
            <!-- 剩余人数 -->
            <Card title="剩余人数" :length="2">
              <Remain/>
            </Card>
            <!-- 天气 -->
            <Card title="天气" :length="2">
              <Weather/>
            </Card>
          </template>
          <template v-else-if="nowMobileMenu === 'package'">
            <!-- 包裹 -->
            <Package/>
          </template>
          <template v-else-if="nowMobileMenu === 'equipment'">
            <!-- 装备 -->
            <Equipment/>
          </template>
        </div>
        <div v-if="['news', 'chat'].includes(nowMobileMenu)" class="m-1">
          <News v-if="nowMobileMenu === 'news'" />
          <Chat v-if="nowMobileMenu === 'chat'" />
        </div>
      </div>
      <!-- 侧边栏 -->
      <!-- <Sidebar/> -->
      <!-- 游戏行动 -->
      <div
        class="fixed flex flex-col w-screen bottom-0 z-1 transition-opacity"
        :class="state.hideDrawer && 'opacity-20', mobileHide && 'translate-y-full'"
      >
        <div
          v-if="isMobile"
          @click="mobileHide = !mobileHide"
          class="absolute w-full bg-surface pointer-events-auto h-6 p-1 flex -top-6 border-t-2 border-outlineVariant"
        >
          <div class="w-20 bg-onSurface/40 rounded-xl m-auto h-0.5"></div>
        </div>
        <Drawer/>
        <Action/>
      </div>
      <Death/>
      <Dialog/>
    </div>
    </Transition>
    <div v-if="!state.playerState?.playerInfo.name" class="min-h-screen flex pt-10 pb-4 relative <md:(pt-16 max-h-screen overflow-y-auto)">
      <!-- 入场手续 -->
      <Transition>
        <Valid :state="validState" v-if="state.page == 'valid'"/>
      </Transition>
      <!-- 游戏结束 -->
      <Transition>
        <End :state="endState" v-if="state.page == 'end'"/>
      </Transition>
      <!-- 游戏错误 -->
      <Transition>
        <div v-if="error" class="m-auto w-full flex flex-col items-center">
          <p class="text-onSurface pb-4 text-xl">{{ error }}</p>
          <router-link to="/" class="ring-1.5 ring-primary p-0.5 cursor-pointer">
            <p class="text-xl bg-primary pl-3.5 pr-3 py-1 text-onPrimary font-bold tracking-widest transition-colors hover:bg-transparent hover:text-primary">返回首页</p>
          </router-link>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="postcss">
/* :root {
  scrollbar-gutter: stable;
} */
::selection {
  @apply text-onPrimary bg-primary;
}
*::-webkit-scrollbar {
  width: 6px;
  /* background: #000; */
  @apply bg-surface;
}
*::-webkit-scrollbar-thumb {
  @apply bg-surfaceContainerHighest;
  min-height: 10px;
}
.tippy-content > div::-webkit-scrollbar, .box-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.tippy-content > div::-webkit-scrollbar-thumb, .box-scrollbar::-webkit-scrollbar-thumb {
  border: none;
}

span[tooltip] {
  @apply relative flex justify-center items-center w-max;
}
span[tooltip]::after {
  content: '?';
  @apply text-xs opacity-50 ml-0.5 w-0;
}
.inline-flex span[tooltip]::after {
  @apply w-2;
}
.range {
  @apply appearance-none bg-primary/60 rounded;
}
.range::-webkit-slider-thumb {
  @apply appearance-none bg-primary w-4 h-4 rounded-xl;
}
.neonblue { animation: blueflicker 1.5s infinite alternate; }
.neonred { animation: redflicker 1.5s infinite alternate; }
.neonyellow { animation: yellowflicker 1.5s infinite alternate; }
.neonorange { animation: orangeflicker 1.5s infinite alternate; }
.sparkle {
	animation: sparklefade 2s ease-in-out infinite;
}
@keyframes sparklefade {
	0% {
		filter: sepia(100%) brightness(88%) blur(0.3px);
	}
	50% {
		filter: sepia(100%) brightness(133%) blur(0px);
	}
	100% {	
		filter: sepia(100%) brightness(88%) blur(0.3px);
	}
}
.mtgcolorless {
  @apply surface;
	text-shadow: 0px 0px 2px rgba(137, 137, 137, 0.706), 0px 0px 3px #f5f5f586, 0px 0px 4px rgb(255, 255, 255);
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgred {
  @apply surface;
	text-shadow: 0px 0px 2px #F43F5E, 0px 0px 3px #F43F5E, 0px 0px 4px #F43F5E;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgblue {
  @apply surface;
	text-shadow: 0px 0px 2px #378bc6, 0px 0px 3px #0da0a0, 0px 0px 4px #0a4fd0;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtggreen {
  @apply surface;
	text-shadow: 0px 0px 2px #10B981, 0px 0px 3px #10B981, 0px 0px 4px #10B981;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgwhite {
  @apply surface;
	text-shadow: 0px 0px 2px #ffffdd, 0px 0px 3px #ededc4, 0px 0px 4px #cfcf9f;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgblack {
  @apply surface;
	text-shadow: 0px 0px 2px #8B5CF6, 0px 0px 3px #8B5CF6, 0px 0px 4px #8B5CF6;
	animation: fadeInOut 2s ease-in-out infinite;
}
@keyframes fadeInOut {
	0% {
		filter: brightness(89%) blur(0.3px);
	}
	50% {
		filter: brightness(122%) blur(0px);
	}
	100% {	
		filter: brightness(89%) blur(0.3px);
	}
}
.rainbow {
	text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
	animation: rainbowshimmer 2s ease-in-out infinite;
}
@keyframes rainbowshimmer {
  0% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(230, 0, 115, 0.2), 0 0 40px rgba(230, 0, 115, 0.2), 0 0 50px rgba(230, 0, 115, 0.2), 0 0 60px rgba(230, 0, 115, 0.2), 0 0 70px rgba(230, 0, 115, 0.2); }
  20% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(0, 255, 0, 0.2), 0 0 40px rgba(0, 255, 0, 0.2), 0 0 50px rgba(0, 255, 0, 0.2), 0 0 60px rgba(0, 255, 0, 0.2), 0 0 70px rgba(0, 255, 0, 0.2); }
  40% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 0, 0.2), 0 0 40px rgba(255, 255, 0, 0.2), 0 0 50px rgba(255, 255, 0, 0.2), 0 0 60px rgba(255, 255, 0, 0.2), 0 0 70px rgba(255, 255, 0, 0.2); }
  60% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(0, 0, 255, 0.2), 0 0 40px rgba(0, 0, 255, 0.2), 0 0 50px rgba(0, 0, 255, 0.2), 0 0 60px rgba(0, 0, 255, 0.2), 0 0 70px rgba(0, 0, 255, 0.2); }
  80% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 0, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.2), 0 0 50px rgba(255, 0, 255, 0.2), 0 0 60px rgba(255, 0, 255, 0.2), 0 0 70px rgba(255, 0, 255, 0.2); }
  100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(230, 0, 115, 0.2), 0 0 40px rgba(230, 0, 115, 0.2), 0 0 50px rgba(230, 0, 115, 0.2), 0 0 60px rgba(230, 0, 115, 0.2), 0 0 70px rgba(230, 0, 115, 0.2); }
}
@keyframes blueflicker {
	0%, 18%, 22%, 25%, 53%, 57%, 100% {
	  text-shadow:
		0 0 4px #fff,
		0 0 7px #fff,
		0 0 10px #fff,
		0 0 15px #00ffff,
		0 0 22px #00ffff,
		0 0 35px #00ffff,
		0 0 40px #0060ff,
		0 0 50px #0060ff;
	}
	20%, 24%, 55% {       
	  text-shadow: none;
	}
  }

  @keyframes redflicker {
	0%, 18%, 22%, 25%, 53%, 57%, 100% {
	  text-shadow:
		0 0 4px #fff,
		0 0 7px #fff,
		0 0 10px #fff,
		0 0 15px #FCE7E7,
		0 0 22px #FDB5B5,
		0 0 35px #FF7979,
		0 0 40px #FF6161,
		0 0 50px #FF0000;
	}
	20%, 24%, 55% {       
	  text-shadow: none;
	}
  }

@keyframes yellowflicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow:
      0 0 4px rgba(255, 255, 255, 0.2),
      0 0 7px rgba(255, 255, 255, 0.2),
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 15px rgba(248, 252, 218, 0.2),
      0 0 22px rgba(246, 253, 181, 0.2),
      0 0 35px rgba(242, 255, 121, 0.2),
      0 0 40px rgba(252, 255, 97, 0.2),
      0 0 50px rgba(255, 251, 0, 0.2);
  }
  20%, 24%, 55% {       
    text-shadow: none;
  }
}
@keyframes orangeflicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow:
      0 0 4px rgba(255, 255, 255, 0.2),
      0 0 7px rgba(255, 255, 255, 0.2),
      0 0 10px rgba(255, 255, 255, 0.2),
      0 0 15px rgba(252, 238, 218, 0.2),
      0 0 22px rgba(253, 230, 181, 0.2),
      0 0 35px rgba(255, 193, 121, 0.2),
      0 0 40px rgba(255, 173, 97, 0.2),
      0 0 50px rgba(255, 102, 0, 0.2);
  }
  20%, 24%, 55% { text-shadow: none; }
}
.b {
  border: none;
}
.background {
  filter: brightness(5) grayscale(0.5) opacity(0.05);
}
/* 故障效果 */
.glitch1 {
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
    0.025em 0.04em 0 #fffc00;
  animation: glitch1 725ms infinite;
}
.glitchb {
  color: rgb(30, 150, 255);
  font-weight: bold;
  position: relative;
  text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
    0.025em 0.04em 0 #fffc00;
  animation: glitch1 725ms infinite;
}
.glitchb span {
  position: absolute;
  top: 0;
  left: 0;
}
.glitchb span:first-child {
  animation: glitch1 500ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
}
.glitchb span:last-child {
  animation: glitch1 375ms infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(0.04em, 0.03em);
  opacity: 0.75;
}
.glitch1 span {
  position: absolute;
  top: 0;
  left: 0;
}
.glitch1 span:first-child {
  animation: glitch1 500ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
}
.glitch1 span:last-child {
  animation: glitch1 375ms infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(0.04em, 0.03em);
  opacity: 0.75;
}
@keyframes glitch1 {
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
      -0.04em -0.025em 0 #fffc00;
  }
}
</style>