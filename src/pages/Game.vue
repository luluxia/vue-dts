<script lang="ts" setup>
import { onMounted, provide, reactive, ref, watch } from 'vue'
import Card from '../components/Card.vue'
import Action from '../components/Action.vue'
import Drawer from '../components/Drawer.vue'
import Sidebar from '../components/Sidebar.vue'
import Loading from '../components/Loading.vue'
// 玩家状态组件
import Player from '../components/cards/Player.vue'
import Level from '../components/cards/Level.vue'
import Hp from '../components/cards/Hp.vue'
import Mp from '../components/cards/Mp.vue'
import Rage from '../components/cards/Rage.vue'
import SongSoul from '../components/cards/SongSoul.vue'
import Gift from '../components/cards/Gift.vue'
import Tactic from '../components/cards/Tactic.vue'
import Pose from '../components/cards/Pose.vue'
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
import Debuffs from '../components/cards/Debuffs.vue'
// 装备包裹
import Equipment from '../components/Equipment.vue'
import Package from '../components/Package.vue'
// 死亡信息
import Death from '../components/blocks/Death.vue'
// 弹框
import Dialog from '../components/blocks/Dialog.vue'
// 入场手续
import Valid from '../components/blocks/Valid.vue'
// 结局
import End from '../components/blocks/End.vue'
import axios from 'axios'
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
</script>

<template>
  <div>
    <!-- 加载 -->
    <Transition><Loading/></Transition>
    <!-- 背景 -->
    <div class="fixed w-screen h-screen top-0">
      <img
        v-if="state.playerState?.area.nowArea"
        class="w-full h-full object-cover opacity-10 grayscale"
        :src="`/old/img/location/${state.playerState?.area.nowArea}.jpg`" alt=""
      >
      <img v-else class="w-full h-full object-cover" src="/img/bg.png"/>
    </div>
    <!-- 游戏主界面 -->
    <Transition>
    <div v-if="state.playerState?.playerInfo.name">
      <!-- 游戏卡片 -->
      <div class="max-w-screen-xl mx-auto pt-16" :style="{'margin-bottom': (state.drawerHeight || 100) + 20 + 'px'}">
        <p class="w-19 w-38.5 w-58 w-77.5 hidden"></p>
        <div class="flex justify-between">
          <!-- 左侧 -->
          <div class="space-y-1">
            <!-- 状态 -->
            <div class="relative">
              <div class="border-b-zinc-800 border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider">
                  状态<span class="text-base -ml-1 opacity-10">STATUS</span>
                </h1>
                <div class="flex space-x-5">
                  <p class="text-zinc-400"><span class="font-bold">击杀数</span> {{ state.playerState?.killNum }}</p>
                  <p v-if="state.playerState?.rp" class="text-zinc-400"><span class="font-bold">报应点数</span> {{ state.playerState?.rp }}</p>
                </div>
              </div>
              <!-- 状态 内容 -->
              <div class="flex flex-wrap max-w-156">
                <!-- 头像 -->
                <Card :title="state.playerState?.playerInfo.nick" :length="3" class="tooltip-down">
                  <Player/>
                </Card>
                <!-- 等级 -->
                <Card class="overflow-hidden" title="等级">
                  <Level/>
                </Card>
                <!-- 生命 -->
                <Card class="overflow-hidden" title="生命">
                  <Hp/>
                </Card>
                <!-- 体力 -->
                <Card class="overflow-hidden" title="体力">
                  <Mp/>
                </Card>
                <!-- 怒气 -->
                <Card title="怒气">
                  <Rage/>
                </Card>
                <!-- 歌魂 -->
                <Card title="歌魂">
                  <SongSoul/>
                </Card>
                <!-- 内定称号 -->
                <Card title="内定称号" :length="2">
                  <Gift/>
                </Card>
                <!-- 基础姿态 -->
                <Card title="基础姿态" :length="2">
                  <Pose/>
                </Card>
                <!-- 应战策略 -->
                <Card title="应战策略" :length="2">
                  <Tactic/>
                </Card>
                <!-- 攻击力 -->
                <Card title="攻击力">
                  <Attack/>
                </Card>
                <!-- 防御力 -->
                <Card title="防御力">
                  <Defense/>
                </Card>
                <!-- 队伍 -->
                <Card title="队伍" :length="2">
                  <Team/>
                </Card>
                <!-- 殴熟 -->
                <Card title="殴熟">
                  <Proficiency type="melee"/>
                </Card>
                <!-- 斩熟 -->
                <Card title="斩熟">
                  <Proficiency type="slash"/>
                </Card>
                <!-- 射熟 -->
                <Card title="射熟">
                  <Proficiency type="shoot"/>
                </Card>
                <!-- 投熟 -->
                <Card title="投熟">
                  <Proficiency type="throw"/>
                </Card>
                <!-- 爆熟 -->
                <Card title="爆熟">
                  <Proficiency type="blast"/>
                </Card>
                <!-- 灵熟 -->
                <Card title="灵熟">
                  <Proficiency type="spirit"/>
                </Card>
              </div>
            </div>
            <!-- 位置 -->
            <div class="relative">
              <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
                地点<span class="text-base -ml-1 opacity-10">AREA</span>
              </h1>
              <!-- 位置 内容 -->
              <div class="flex flex-wrap max-w-156">
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
            <div class="relative">
              <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
                负面效果<span class="text-base -ml-1 opacity-10">DEBUFF</span>
              </h1>
              <!-- 负面效果 内容 -->
              <div class="flex flex-wrap max-w-156">
                <!-- 负面效果 -->
                <Debuffs/>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div class="space-y-1">
            <!-- 装备 -->
            <div class="relative">
              <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-800 border-b-2 border-dashed mb-1">
                装备<span class="text-base -ml-1 opacity-10">EQUIPMENT</span>
              </h1>
              <!-- 装备 内容 -->
              <div v-if="state.playerState" class="flex flex-wrap max-w-156">
                <Equipment/>
              </div>
            </div>
            <!-- 包裹 -->
            <div class="relative">
              <div class="border-b-zinc-800 border-b-2 border-dashed flex items-center justify-between mb-1">
                <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider">
                  包裹<span class="text-base -ml-1 opacity-10">PACKAGE</span>
                </h1>
                <p class="text-zinc-400"><span class="font-bold">金钱</span> {{ state.playerState?.money }} 元</p>
              </div>
              <!-- 包裹 内容 -->
              <div v-if="state.playerState" class="flex flex-wrap max-w-156">
                <Package/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 侧边栏 -->
      <Sidebar/>
      <!-- 游戏行动 -->
      <Drawer/>
      <Action/>
      <Death/>
      <Dialog/>
    </div>
    </Transition>
    <div v-if="!state.playerState?.playerInfo.name" class="w-screen h-screen absolute top-0 flex">
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
          <p class="text-zinc-300 pb-4 text-xl">{{ error }}</p>
          <router-link to="/" class="ring-1.5 ring-zinc-300 text-zinc-300 p-0.5 cursor-pointer">
            <p class="text-xl bg-zinc-300 pl-3.5 pr-3 py-1 text-zinc-800 font-bold tracking-widest transition-colors hover:bg-transparent hover:text-zinc-300">返回首页</p>
          </router-link>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="postcss">
:root {
  scrollbar-gutter: stable;
}
::selection {
  @apply text-white bg-zinc-600/80;
}
*::-webkit-scrollbar {
  width: 10px;
}
*::-webkit-scrollbar-thumb {
  background: hsla(0,0%,100%,.5);
  background-clip: padding-box;
  border: 2px solid hsla(0,0%,100%,0);
  border-top: none;
  border-bottom: none;
  min-height: 10px;
}
.tippy-content > div::-webkit-scrollbar, .box-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.tippy-content > div::-webkit-scrollbar-thumb, .box-scrollbar::-webkit-scrollbar-thumb {
  border: none;
}
.avatar {
  clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%);
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
span[tooltip]::before {
  content: attr(tooltip);
  @apply bg-zinc-800/95 text-sm font-normal text-left p-2 absolute bottom-8 w-max max-w-70 border-2 text-zinc-200 border-zinc-600 z-2 whitespace-pre-line shadow text-shadow-none opacity-0 pointer-events-none transition transition-opacity;
}
span[tooltip]:hover::before {
  opacity: 1;
}
.tooltip-down span[tooltip]::before {
  @apply top-8 bottom-auto;
}
input[type="range"] {
  @apply appearance-none bg-zinc-600 rounded;
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
  color: #eee;
	text-shadow: 0px 0px 2px rgba(137, 137, 137, 0.706), 0px 0px 3px #f5f5f586, 0px 0px 4px rgb(255, 255, 255);
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgred {
  color: #eee;
	text-shadow: 0px 0px 2px #F43F5E, 0px 0px 3px #F43F5E, 0px 0px 4px #F43F5E;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgblue {
  color: #eee;
	text-shadow: 0px 0px 2px #378bc6, 0px 0px 3px #0da0a0, 0px 0px 4px #0a4fd0;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtggreen {
  color: #eee;
	text-shadow: 0px 0px 2px #10B981, 0px 0px 3px #10B981, 0px 0px 4px #10B981;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgwhite {
  color: #eee;
	text-shadow: 0px 0px 2px #ffffdd, 0px 0px 3px #ededc4, 0px 0px 4px #cfcf9f;
	animation: fadeInOut 2s ease-in-out infinite;
}
.mtgblack {
  color: #eee;
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
</style>