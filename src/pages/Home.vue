<script lang="ts" setup>
import { onMounted, ref, inject } from 'vue'
import Card from '../components/Card.vue'
import axios from 'axios'
const homeState = ref({}) as any
const time = ref('')
onMounted(async () => {
  await axios.get('/old/index.php?is_new=1').then(res => {
    homeState.value = res.data
    if (homeState.value.showNowTime) {
      updateTime(homeState.value.timing, true)
    } else if (homeState.value.showNextTime) {
      updateTime(homeState.value.timing, false)
    }
  })
})
const updateTime = (timing: number, mode: boolean): void => {
  if (timing) {
    let t = timing
    let tm = mode
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = t % 60
    // add a zero in front of numbers<10
    const checkTime = (i: number): string => (i < 10 ? `0${i}` : `${i}`)
    time.value = `${checkTime(h)}:${checkTime(m)}:${checkTime(s)}`
    tm ? t++ : t--
    setTimeout(() => updateTime(t, tm), 1000)
  } else {
    window.location.reload()
  }
}
</script>
<template>
  <div class="h-[calc(100vh-4rem)] pt-2 flex">
    <!-- 背景 -->
    <div class="fixed w-screen h-screen top-0 pointer-events-none">
      <img class="w-full h-full object-cover" src="/img/bg.png"/>
    </div>
    <div v-if="homeState.num" class="flex w-screen-xl justify-between m-auto">
      <div class="space-y-1">
        <div class="border-b-zinc-800 border-b-2 border-dashed flex items-center justify-between mb-1">
          <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider">
            游戏情报<span class="text-base -ml-1 opacity-10">STATUS</span>
          </h1>
        </div>
        <div class="flex flex-wrap max-w-156">
          <Card title="当前回合" :length="4" class="h-30">
            <div class="m-auto text-center text-zinc-300">
              <p>
                第 <span class="font-bold">{{ homeState.num }}</span> 回游戏 <span v-html="homeState.state"></span>
              </p>
              <p v-if="homeState.showNowTime" class="text-sm text-zinc-400">本局游戏已经进行 {{ time }}</p>
              <p v-else class="text-sm text-zinc-400">
                <template v-if="homeState.showNextTime">下局游戏开始于 {{ time }} 后</template>
                <template>下局游戏开始时间未定</template>
              </p>
            </div>
          </Card>
          <Card title="禁区动态" :length="4" class="h-30">
            <div class="m-auto text-zinc-300">
              <p>
                禁区间隔时间
                <span class="font-bold">{{ homeState.areaHour }}</span>
                分钟
                <span class="grey">/ </span>
                <span class="font-bold">{{ homeState.areaLimit }}</span>
                禁后停止激活
              </p>
              <p>
                每次增加禁区
                <span class="font-bold">{{ homeState.areaAdd }}</span>
                个
                <span class="grey">/ </span>
                当前禁区数
                <span class="font-bold">{{ homeState.areaNum }}</span>
              </p>
              <span tooltip="注意：进入连斗后，自动逃避功能自动关闭。">
                自动逃避禁区功能
                <span class="yellow !inline-flex pl-1">开放</span>
              </span>
            </div>
          </Card>
          <Card title="上局结果" :length="2" class="h-30">
            <div class="m-auto text-center text-zinc-300">
              <p>{{ homeState.lastResult }}</p>
              <div v-if="homeState.lastWinner">
                <p class="text-sm mt-0.5">优胜者</p>
                <p class="text-sm">{{ homeState.lastWinner }}</p>
              </div>
            </div>
          </Card>
          <Card v-if="homeState.maxDamagePlayer" :title="`${homeState.showNowTime ? '当前' : '上局'}最高伤害`" :length="2" class="h-30">
            <div class="m-auto text-center text-zinc-300">
              <p>{{ homeState.maxDamagePlayer }}</p>
              <p class="text-sm">{{ homeState.maxDamage }}</p>
            </div>
          </Card>
          <Card title="当前人数" :length="2" class="h-30">
            <div class="m-auto text-zinc-300">
              <p>激活人数 <span class="font-bold">{{ homeState.validNum }}</span></p>
              <p>生存人数 <span class="font-bold">{{ homeState.aliveNum }}</span></p>
              <p>死亡总数 <span class="font-bold">{{ homeState.deathNum }}</span></p>
            </div>
          </Card>
          <Card v-if="homeState.roomID && homeState.roomID != 0" title="当前房间" :length="2" class="h-30">
            <div class="m-auto text-center text-zinc-300">
              <p>{{ homeState.roomID }} 号</p>
            </div>
          </Card>
        </div>
        <!-- <div class="border-b-zinc-800 border-b-2 border-dashed flex items-center justify-between mb-1">
          <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider">
            行动<span class="text-base -ml-1 opacity-10">ACTION</span>
          </h1>
        </div> -->
        <div class="flex flex-wrap w-156">
          <Card :length="2">
            <div class="w-full h-full bg-sky-600/80 p-0.5 pattern-diagonal-lines-sm text-zinc-700/5">
              <div class="w-full h-full border-2 border-zinc-800 flex">
                <p class="m-auto font-bold text-zinc-300 text-xl tracking-widest">进入游戏</p>
              </div>
            </div>
          </Card>
          <Card :length="2">
            <div class="w-full h-full bg-zinc-300/80 p-0.5 pattern-diagonal-lines-sm text-zinc-700/5">
              <div class="w-full h-full border-2 border-zinc-800 flex">
                <p class="m-auto font-bold text-zinc-800 text-xl tracking-widest">查看房间列表</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div class="space-y-1">
        <div class="border-b-zinc-800 border-b-2 border-dashed flex items-center justify-between mb-1">
          <h1 class="p-1 text-zinc-400 text-xl font-bold tracking-wider">
            站长留言<span class="text-base -ml-1 opacity-10">NEWS</span>
          </h1>
        </div>
        <div class="flex flex-wrap w-156 text-zinc-300 space-y-2">
          <img class="m-auto w-full" src="https://res.dts.gay/images/yellowknifecopy.png" alt="">
          <p>巴拉巴拉</p>
        </div>
      </div>
    </div>
  </div>
</template>