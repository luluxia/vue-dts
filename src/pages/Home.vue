<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import tippy from 'tippy.js'
import { get, post } from '../utils/api'
import Card from '../components/Card.vue'
import Message from '../components/Message'
const isMobile = inject('isMobile') as any
const homeState = ref({}) as any
const time = ref('')
onMounted(async () => {
  await get('index.php').then(res => {
    homeState.value = res
    if (homeState.value.showNowTime) {
      updateTime(homeState.value.timing, true)
    } else if (homeState.value.showNextTime) {
      updateTime(homeState.value.timing, false)
    }
  })
  tippy('span[tooltip]', {
    arrow: false,
    content: (el) => {
      const content = el.getAttribute('tooltip') ? el.getAttribute('tooltip') : '暂无说明'
      return content as string
    },
    allowHTML: true,
    theme: 'tooltip',
    appendTo: () => document.body,
  })
  tippy('span[tooltip2]', {
    arrow: false,
    content: (el) => {
      const content = el.getAttribute('tooltip2') ? el.getAttribute('tooltip2') : '暂无说明'
      return content as string
    },
    allowHTML: true,
    theme: 'tooltip',
    appendTo: () => document.body,
  })
})
let timer = 0
const updateTime = async (timing: number, mode: boolean): Promise<void> => {
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
    timer = setTimeout(() => updateTime(t, tm), 1000)
  } else {
    clearTimeout(timer)
    await get('index.php').then(res => {
      homeState.value = res
      if (homeState.value.showNowTime) {
        updateTime(homeState.value.timing, true)
      } else if (homeState.value.showNextTime) {
        updateTime(homeState.value.timing, false)
      }
    })
  }
}
const roomAction = async (action: string) => {
  await post('index.php', { roomact: action }).then(async res => {
    const data = res as any
    if (data?.innerHTML?.roomerror) {
      Message({ message: data.innerHTML.roomerror })
    } else {
      clearTimeout(timer)
      await get('index.php').then(res => {
        homeState.value = res
        if (homeState.value.showNowTime) {
          updateTime(homeState.value.timing, true)
        } else if (homeState.value.showNextTime) {
          updateTime(homeState.value.timing, false)
        }
      })
    }
  })
}
/** 移动端 */
const mobileMenu = [
  { title: '游戏情报', key: 'status' },
  { title: '房间', key: 'room' },
  { title: '新闻', key: 'news' },
]
const nowMobileMenu = ref('status')
</script>

<template>
  <div class="min-h-screen flex pt-10 pb-4 <md:(pt-12 min-h-max)">
    <!-- 背景 -->
    <div class="fixed w-screen h-screen top-0 pointer-events-none">
      <img class="w-full h-full object-cover" src="https://llx.life/works/dts/img/bg.png"/>
    </div>
    <Transition>
      <!-- PC端页面 -->
      <div v-if="homeState.num && !isMobile" class="relative flex justify-between space-x-4 m-auto">
        <!-- 左侧 -->
        <div class="space-y-1">
          <!-- 游戏情报 -->
          <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
            <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
              游戏情报<span class="text-base -ml-1 opacity-20">STATUS</span>
            </h1>
          </div>
          <div class="flex flex-col">
            <div class="flex">
              <!-- 当前回合 -->
              <Card title="当前回合" :length="4" class="h-30" :width="18.5">
                <div class="m-auto text-center">
                  <p>
                    第 <span class="font-bold">{{ homeState.num }}</span> 回游戏 <span v-html="homeState.state"></span>
                  </p>
                  <p v-if="homeState.showNowTime" class="text-sm opacity-80">本局游戏已经进行 {{ time }}</p>
                  <p v-else class="text-sm opacity-80">
                    <template v-if="homeState.showNextTime">下局游戏开始于 {{ time }} 后</template>
                    <template>下局游戏开始时间未定</template>
                  </p>
                </div>
              </Card>
              <!-- 禁区动态 -->
              <Card title="禁区动态" :length="4" class="h-30" :width="18.5">
                <div class="m-auto">
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
            </div>
            <div class="flex">
              <!-- 上局结果 -->
              <Card title="上局结果" :length="2" class="h-30" :width="18.5">
                <div class="m-auto text-center">
                  <p>{{ homeState.lastResult }}</p>
                  <div v-if="homeState.lastWinner">
                    <p class="text-sm mt-0.5">优胜者</p>
                    <p class="text-sm">{{ homeState.lastWinner }}</p>
                  </div>
                </div>
              </Card>
              <!-- 当前/上局最高伤害 -->
              <Card :title="`${homeState.showNowTime ? '当前' : '上局'}最高伤害`" :length="2" class="h-30" :width="18.5">
                <div class="m-auto text-center">
                  <p>{{ homeState.maxDamagePlayer || '无' }}</p>
                  <p v-if="homeState.maxDamage != 0" class="text-sm">{{ homeState.maxDamage }}</p>
                </div>
              </Card>
              <!-- 当前人数 -->
              <Card title="当前人数" :length="2" class="h-30" :width="18.5">
                <div class="m-auto">
                  <p>激活人数 <span class="font-bold">{{ homeState.validNum }}</span></p>
                  <p>生存人数 <span class="font-bold">{{ homeState.aliveNum }}</span></p>
                  <p>死亡总数 <span class="font-bold">{{ homeState.deathNum }}</span></p>
                </div>
              </Card>
              <!-- 进入游戏 -->
              <Card :length="2" class="h-30" :width="18.5">
                <router-link to="/game" class="w-full h-full bg-primary p-0.5 rounded-sm pattern-diagonal-lines-sm text-onPrimary/5 hover:bg-primary/90">
                  <div class="w-full h-full border-2 border-outlineVariant flex rounded-sm">
                    <p class="m-auto font-bold text-xl tracking-widest text-onPrimary">进入游戏</p>
                  </div>
                </router-link>
              </Card>
            </div>
          </div>
          <!-- 房间 -->
          <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
            <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
              房间<span class="text-base -ml-1 opacity-10">ROOM</span>
            </h1>
            <p v-if="homeState.roomID != 0" class="text-primary">当前房间 <span class="font-bold">{{ homeState.roomID }}</span> 号</p>
          </div>
          <!-- 创建房间 -->
          <div
            @click="roomAction('create')"
            v-if="homeState.canCreateRoom"
            class="w-full bg-primaryContainer p-0.5 rounded pattern-diagonal-lines-sm text-primary/5 cursor-pointer hover:bg-primaryContainer/90"
          >
            <div class="w-full h-full border-2 border-primary flex rounded">
              <p class="m-auto font-bold text-primary text-xl tracking-widest">创建新的房间</p>
            </div>
          </div>
          <!-- 房间列表 -->
          <div class="bg-surfaceContainer/50 text-onSurface text-center h-88 overflow-y-auto overscroll-contain rounded overflow-hidden">
            <div class="flex w-full justify-between py-1 bg-primaryContainer text-onPrimaryContainer opacity-80 font-bold text-sm sticky top-0">
              <p class="w-15">编号</p>
              <p class="w-20">状态</p>
              <p class="flex-1">创建者/房主</p>
              <p class="w-15">人数</p>
              <p class="w-30">操作</p>
            </div>
            <div v-for="room in homeState.rooms" class="flex w-full justify-between py-1 text-onSurface transition hover:bg-surfaceDim">
              <p class="w-15">{{ room.id }}</p>
              <p class="w-20" v-html="room.status"></p>
              <p class="flex-1">{{ room.owner }}</p>
              <p class="w-15">{{ room.nums }}</p>
              <p class="room-action w-30 space-x-2">
                <span v-for="item in room.action">
                  <span
                    v-if="item == '退出'"
                    @click="roomAction('exit')"
                    tooltip2="退出房间后，如房间内没有其他玩家，则房间会解散；<br/>房主退出房间会将房主权限转移给房间内其他玩家；"
                    class="cursor-pointer"
                  >{{ item }}</span>
                  <span
                    v-else-if="item == '解散'"
                    @click="roomAction('close')"
                    tooltip2="不能解散正在进行游戏且尚有其他玩家存活的房间。"
                    class="cursor-pointer"
                  >{{ item }}</span>
                  <span
                    v-else-if="item == '加入'"
                    @click="roomAction('join' + room.id)"
                    class="cursor-pointer"
                  >{{ item }}</span>
                  <span v-else>{{ item }}</span>
                </span>
              </p>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="space-y-1 flex-1">
          <div class="border-b-outlineVariant border-b-2 border-dashed flex items-center justify-between mb-1">
            <h1 class="py-1 text-xl font-bold tracking-wider text-primary">
              新闻<span class="text-base -ml-1 opacity-10">NEWS</span>
            </h1>
          </div>
          <div class="text-onSurface">
            <div class="text-center my-5 text-primary">
              <p class="text-3xl font-bold">常磐大逃杀</p>
              <p class="opacity-60">次世代文字类多人在线游戏</p>
            </div>
            <div class="my-5">
              <p class="font-bold">快速指南：</p>
              <p>常磐大逃杀是一个在线游戏，需要账号存储游戏数据，请注册或使用现有账号登录。</p>
              <p>你可以直接进入已在进行中的游戏，或者创建一个新的游戏房间。</p>
            </div>
            <div class="my-5">
              <p class="font-bold">相关链接：</p>
              <a class="text-primary" target="_blank" href="https://dts.loli.camp/old/"> 旧版界面 </a>
              <a class="text-primary" target="_blank" href="https://dts.loli.camp/old/help.php"> 游戏帮助 </a>
              <a class="text-primary" target="_blank" href="https://bbs.brdts.online/"> 官方论坛 </a>
              <a class="text-primary" target="_blank" href="https://amarillonmc.github.io/Settings/"> 游戏设定 </a>
              <a class="text-primary" target="_blank" href="https://docs.qq.com/doc/DUkZ4eGdNSGJFSEpD"> 虚拟战场简易导览 </a>
            </div>
            <div class="my-5">
              <p class="opacity-50">当前游戏版本仍在持续开发中，功能尚不完整，游戏数据将不定时更新。</p>
            </div>
            <div v-html="homeState.news"></div>
          </div>
        </div>
      </div>
      <!-- 移动端页面 -->
      <div v-else-if="homeState.num && isMobile" class="w-full">
        <ul class="flex bg-surfaceContainerHighest text-onSurface px-4 py-2 space-x-4">
          <li
            v-for="item in mobileMenu"
            @click="nowMobileMenu = item.key"
            :class="nowMobileMenu === item.key && 'font-bold text-primary'"
          >{{ item.title }}</li>
        </ul>
        <div class="flex flex-wrap p-2">
          <!-- 移动端游戏情报 -->
          <template v-if="nowMobileMenu === 'status'">
            <!-- 当前回合 -->
            <Card title="当前回合" :length="4" class="h-30">
              <div class="m-auto text-center">
                <p>
                  第 <span class="font-bold">{{ homeState.num }}</span> 回游戏 <span v-html="homeState.state"></span>
                </p>
                <p v-if="homeState.showNowTime" class="text-sm opacity-80">本局游戏已经进行 {{ time }}</p>
                <p v-else class="text-sm opacity-80">
                  <template v-if="homeState.showNextTime">下局游戏开始于 {{ time }} 后</template>
                  <template>下局游戏开始时间未定</template>
                </p>
              </div>
            </Card>
            <!-- 禁区动态 -->
            <Card title="禁区动态" :length="4" class="h-30">
              <div class="m-auto">
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
            <!-- 上局结果 -->
            <Card title="上局结果" :length="2" class="h-30">
              <div class="m-auto text-center">
                <p>{{ homeState.lastResult }}</p>
                <div v-if="homeState.lastWinner">
                  <p class="text-sm mt-0.5">优胜者</p>
                  <p class="text-sm">{{ homeState.lastWinner }}</p>
                </div>
              </div>
            </Card>
            <!-- 当前/上局最高伤害 -->
            <Card :title="`${homeState.showNowTime ? '当前' : '上局'}最高伤害`" :length="2" class="h-30">
              <div class="m-auto text-center">
                <p>{{ homeState.maxDamagePlayer || '无' }}</p>
                <p v-if="homeState.maxDamage != 0" class="text-sm">{{ homeState.maxDamage }}</p>
              </div>
            </Card>
            <!-- 当前人数 -->
            <Card title="当前人数" :length="2" class="h-30">
              <div class="m-auto">
                <p>激活人数 <span class="font-bold">{{ homeState.validNum }}</span></p>
                <p>生存人数 <span class="font-bold">{{ homeState.aliveNum }}</span></p>
                <p>死亡总数 <span class="font-bold">{{ homeState.deathNum }}</span></p>
              </div>
            </Card>
            <!-- 进入游戏 -->
            <Card :length="2" class="h-30">
              <router-link to="/game" class="w-full h-full bg-primary p-0.5 rounded-sm pattern-diagonal-lines-sm text-onPrimary/5 hover:bg-primary/90">
                <div class="w-full h-full border-2 border-outlineVariant flex rounded-sm">
                  <p class="m-auto font-bold text-xl tracking-widest text-onPrimary">进入游戏</p>
                </div>
              </router-link>
            </Card>
          </template>
          <!-- 移动端房间 -->
          <div v-else-if="nowMobileMenu === 'room'" class="p-0.25 w-full">
            <!-- 创建房间 -->
            <div
              @click="roomAction('create')"
              v-if="homeState.canCreateRoom"
              class="w-full bg-primaryContainer p-0.5 mb-1 rounded pattern-diagonal-lines-sm text-primary/5 cursor-pointer hover:bg-primaryContainer/90"
            >
              <div class="w-full h-full border-2 border-primary flex rounded">
                <p class="m-auto font-bold text-primary text-xl tracking-widest">创建新的房间</p>
              </div>
            </div>
            <!-- 房间列表 -->
            <div class="bg-surfaceContainer/50 text-onSurface text-center rounded overflow-hidden w-full">
              <div class="flex w-full justify-between py-1 bg-primaryContainer text-onPrimaryContainer opacity-80 font-bold text-sm sticky top-0">
                <p class="w-12">编号</p>
                <p class="w-20">状态</p>
                <p class="flex-1">创建者/房主</p>
                <p class="w-12">人数</p>
                <p class="w-22">操作</p>
              </div>
              <div v-for="room in homeState.rooms" class="flex w-full justify-between py-1 text-onSurface transition hover:bg-surfaceDim">
                <p class="w-12">{{ room.id }}</p>
                <p class="w-20" v-html="room.status"></p>
                <p class="flex-1">{{ room.owner }}</p>
                <p class="w-12">{{ room.nums }}</p>
                <p class="room-action w-22 space-x-2">
                  <span v-for="item in room.action">
                    <span
                      v-if="item == '退出'"
                      @click="roomAction('exit')"
                      tooltip2="退出房间后，如房间内没有其他玩家，则房间会解散；<br/>房主退出房间会将房主权限转移给房间内其他玩家；"
                      class="cursor-pointer"
                    >{{ item }}</span>
                    <span
                      v-else-if="item == '解散'"
                      @click="roomAction('close')"
                      tooltip2="不能解散正在进行游戏且尚有其他玩家存活的房间。"
                      class="cursor-pointer"
                    >{{ item }}</span>
                    <span
                      v-else-if="item == '加入'"
                      @click="roomAction('join' + room.id)"
                      class="cursor-pointer"
                    >{{ item }}</span>
                    <span v-else>{{ item }}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <!-- 移动端新闻 -->
          <template v-else-if="nowMobileMenu === 'news'">
            <div class="text-onSurface p-2">
              <div class="text-center my-5 text-primary">
                <p class="text-3xl font-bold">常磐大逃杀</p>
                <p class="opacity-60">次世代文字类多人在线游戏</p>
              </div>
              <div class="my-5">
                <p class="font-bold">快速指南：</p>
                <p>常磐大逃杀是一个在线游戏，需要账号存储游戏数据，请注册或使用现有账号登录。</p>
                <p>你可以直接进入已在进行中的游戏，或者创建一个新的游戏房间。</p>
              </div>
              <!-- <div class="my-5">
                <p class="font-bold">相关链接：</p>
                <a class="text-primary" target="_blank" href="https://dts.loli.camp/old/"> 旧版界面 </a>
                <a class="text-primary" target="_blank" href="https://dts.loli.camp/old/help.php"> 游戏帮助 </a>
                <a class="text-primary" target="_blank" href="https://bbs.brdts.online/"> 官方论坛 </a>
                <a class="text-primary" target="_blank" href="https://amarillonmc.github.io/Settings/"> 游戏设定 </a>
                <a class="text-primary" target="_blank" href="https://docs.qq.com/doc/DUkZ4eGdNSGJFSEpD"> 虚拟战场简易导览 </a>
              </div> -->
              <div class="my-5">
                <p class="opacity-50">当前游戏版本仍在持续开发中，功能尚不完整，游戏数据将不定时更新。</p>
              </div>
              <div v-html="homeState.news"></div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>