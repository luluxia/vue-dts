<script setup lang="ts">
import { onMounted, ref, reactive, inject } from 'vue'
import axios from 'axios'
import tippy, { hideAll } from 'tippy.js'
import Card from '../Card.vue'
import type { GameState } from '../../types/interface'
const gameState = inject<GameState>('state') as GameState
const props = defineProps({
  state: Object,
})
const nickBtn = ref()
const nickListDom = ref()
const giftBtn = ref()
const giftListDom = ref()
const formState = reactive({
  showAvatar: false,
  chooseAvatar: 0,
  gender: 'm',
  chooseNick: { id: 0, title: '参展者' },
  chooseGift: { id: 0, title: '无' },
  motto: '',
  killMessage: '',
  lastWord: '',
})
onMounted(() => {
  tippy(nickBtn.value, {
    content: nickListDom.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom',
  })
  tippy(giftBtn.value, {
    content: giftListDom.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
    placement: 'bottom',
  })
  formState.chooseAvatar = props.state?.avatar
  formState.gender = props.state?.gender
  formState.chooseNick = props.state?.nickList.find((item: { id: any; }) => item.id == props.state?.nick)
  formState.motto = props.state?.motto
  formState.killMessage = props.state?.killMessage
  formState.lastWord = props.state?.lastWord
})
// 提交
const enterState = ref()
const submit = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  const sendData = new FormData()
  sendData.append('mode', 'enter')
  sendData.append('gender', formState.gender)
  sendData.append('icon', formState.chooseAvatar.toString())
  sendData.append('nick', formState.chooseNick.id.toString())
  sendData.append('club', formState.chooseGift.id.toString())
  sendData.append('motto', formState.motto)
  sendData.append('killmsg', formState.killMessage)
  sendData.append('lastword', formState.lastWord)
  await axios.post('/old/valid.php?is_new=1', sendData).then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    if (res.data.page == 'validOver') {
      enterState.value = res.data
    }
  })
}
const enter = async () => {
  let waitTimer = setTimeout(() => {
    gameState.loading = true
  }, 200)
  await axios.get('/old/game.php?is_new=1').then(res => {
    window.clearTimeout(waitTimer)
    gameState.loading = false
    const data = res.data as any
    gameState.playerState = data.playerState
    gameState.actionLog = data.actionLog
    gameState.page = 'game'
  })
}
</script>

<template>
  <div class="m-auto w-full flex flex-col items-center">
    <p class="text-4xl font-bold text-primary tracking-widest">-入场手续-</p>
    <div class="m-auto w-full border-outlineVariant bg-surface border-t-2 border-b-2 my-4 py-4 flex flex-col">
      <div class="text-onSurface flex flex-1 items-center justify-center">
        <template v-if="!enterState?.name">
          <!-- 入场手续 -->
          <div class="flex items-center bg-surfaceContainer p-1 rounded">
            <img class="w-26 h-26 rounded" :src="'/img/story/story_0.gif'" alt="">
            <div class="text-left pl-2 text-sm">
              <p>欢迎参加本次ACFUN动漫祭。</p>
              <p>我是本次ACFUN动漫祭的工作人员，你可以叫我「亮亮」。</p>
              <p>本次动漫祭不同于以往，各项活动将采用虚拟现实系统进行。</p>
              <p>请参加者如实填写身份资料，以便领取神经接入装置。</p>
              <p>身份资料请填写在下面。</p>
            </div>
          </div>
          <div class="space-y-2">
            <!-- 姓名 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">姓名</p>
              <p class="">{{ state?.name }}</p>
            </div>
            <!-- 头像 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">头像</p>
              <div class="flex justify-center items-center z-1">
                <div
                  class="
                    absolute flex justify-start items-start
                    flex-wrap w-147 bg-surfaceContainerHighest p-1 border-2
                    border-outlineVariant rounded transition opacity-0 pointer-events-none"
                  :class="formState.showAvatar && '!opacity-100 !pointer-events-auto'"
                >
                  <img
                    @click="formState.showAvatar = false; formState.chooseAvatar = i - 1"
                    v-for="i in 21"
                    class="h-20 rounded-sm m-0.5 cursor-pointer transition ring-outline hover:ring-2"
                    :src="`/old/img/${formState.gender}_${i - 1}.gif`"
                  >
                </div>
                <img
                  @click="formState.showAvatar = true"
                  class="h-20 border-2 rounded m-auto cursor-pointer border-outlineVariant transition hover:border-outlineVariant"
                  :src="`/old/img/${formState.gender}_${formState.chooseAvatar}.gif`" alt=""
                >
              </div>
            </div>
            <!-- 性别 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">性别</p>
              <div class="py-1">
                <span
                  class="bg-surfaceContainerHighest px-2.5 py-1.5 text-sm rounded-sm mr-2 cursor-pointer transition ring-outline"
                  :class="formState.gender == 'm' && 'ring-2'"
                  @click="formState.gender = 'm'"
                >男生</span>
                <span
                  class="bg-surfaceContainerHighest px-2.5 py-1.5 text-sm rounded-sm mr-2 cursor-pointer transition ring-outline"
                  :class="formState.gender == 'f' && 'ring-2'"
                  @click="formState.gender = 'f'"
                >女生</span>
              </div>
            </div>
            <!-- 头衔 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">头衔</p>
              <div>
                <p ref="nickBtn" class="bg-surfaceContainerHighest px-2.5 py-1 text-sm rounded-sm w-30 m-auto cursor-pointer transition">
                  {{ formState.chooseNick.title }}
                </p>
                <div ref="nickListDom" class="max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain border-outlineVariant text-center">
                  <p @click="formState.chooseNick = item; hideAll()" v-for="item in state?.nickList" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)">
                    {{ item.title }}
                  </p>
                </div>
              </div>
              <p class="opacity-80 text-sm">选择一个有趣的头衔，部分头衔存在特殊的入场效果</p>
            </div>
            <!-- 称号 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">内定称号</p>
              <div>
                <p ref="giftBtn" class="bg-surfaceContainerHighest px-2.5 py-1 text-sm rounded-sm w-30 m-auto cursor-pointer transition">
                  {{ formState.chooseGift.title }}
                </p>
                <div ref="giftListDom" class="max-h-100 overflow-x-hidden overflow-y-auto overscroll-contain border-outlineVariant text-center">
                  <p class="px-2.5 py-1 min-w-full w-max font-bold">- 普通称号 -</p>
                  <p @click="formState.chooseGift = item; hideAll()" v-for="item in state?.normalGiftList" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)">
                    {{ item.title }}
                  </p>
                  <p class="px-2.5 py-1 min-w-full w-max font-bold">- 特殊称号 -</p>
                  <p @click="formState.chooseGift = item; hideAll()" v-for="item in state?.specialGiftList" class="px-2.5 py-1 min-w-full w-max transition cursor-pointer hover:(bg-primary text-onPrimary)">
                    {{ item.title }}
                  </p>
                </div>
              </div>
              <p class="opacity-80 text-sm">选择“无”时，可在游戏内使用称号卡变更称号</p>
            </div>
            <!-- 口头禅 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">口头禅</p>
              <input v-model="formState.motto" placeholder="写下彰显个性的台词，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm" type="text">
            </div>
            <!-- 杀人宣言 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">杀人宣言</p>
              <input v-model="formState.killMessage" placeholder="写下你杀死对手的留言，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm" type="text">
            </div>
            <!-- 遗言 -->
            <div class="flex items-center space-x-2">
              <p class="font-bold text-sm w-20 mr-2 text-right">遗言</p>
              <input v-model="formState.lastWord" placeholder="写下你不幸被害时的台词，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm" type="text">
            </div>
          </div>
        </template>
        <!-- 进入会场 -->
        <template v-else>
          <div class="flex flex-col items-center space-y-2">
            <div class="flex items-center bg-surfaceContainerHighest/30 p-1 rounded w-max">
              <img class="w-26 h-26 rounded" src="/img/story/story_0.gif" alt="">
              <div class="text-left pl-2 text-sm">
                <p>{{ enterState.name }}，对吧？正在为您创建虚拟身份……</p>
                <p>创建完成！您可以凭这个身份参加我们的特别活动了。</p>
                <p>会场入口就在前面。</p>
                <p>动漫祭的开幕仪式就要开始了，请您尽快入场。</p>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex">
                <!-- 头像 -->
                <Card :title="enterState.nick" :length="4">
                  <div class="flex w-full h-full">
                    <img class="absolute object-cover h-full avatar" :src="`/old/img/${enterState.avatar}`" alt="">
                    <div class="m-auto px-4 relative w-full flex flex-col items-end">
                      <p class="font-bold truncate tracking-wide bg-surfaceContainerHighest/80 w-max px-1 rounded">{{ enterState.name }}</p>
                      <p class="text-xs mt-1 px-1">{{ enterState.sub }}</p>
                    </div>
                  </div>
                </Card>
                <!-- 生命 -->
                <Card title="生命">
                  <p class="m-auto">{{ enterState.nowHp }}</p>
                </Card>
                <!-- 体力 -->
                <Card title="体力">
                  <p class="m-auto">{{ enterState.nowMp }}</p>
                </Card>
                <!-- 攻击 -->
                <Card title="攻击">
                  <p class="m-auto">{{ enterState.attack }}</p>
                </Card>
                <!-- 防御 -->
                <Card title="防御">
                  <p class="m-auto">{{ enterState.defense }}</p>
                </Card>
              </div>
              <div class="flex">
                <!-- 内定称号 -->
                <Card title="内定称号" :length="2">
                  <div class="m-auto text-center">
                    <p>{{ enterState.gift }}</p>
                  </div>
                </Card>
                <!-- 武器 -->
                <Card title="武器" :length="2">
                  <div class="m-auto text-center">
                    <p>{{ enterState.weapon }}</p>
                  </div>
                </Card>
                <!-- 随机道具1 -->
                <Card title="随机道具" :length="4">
                  <div class="m-auto text-center">
                    <p>{{ enterState.randomItem1 }}</p>
                    <p>{{ enterState.randomItem2 }}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 返回首页 -->
    <div v-if="!enterState?.name" @click="submit()" class="ring-1.5 ring-primary p-0.5 cursor-pointer">
      <p
        class="
          text-xl bg-primary pl-3.5 pr-3 py-1 text-onPrimary font-bold tracking-widest transition-colors
          hover:bg-transparent hover:text-primary
        "
      >提交</p>
    </div>
    <div v-else @click="enter()" class="ring-1.5 ring-primary p-0.5 cursor-pointer">
      <p
        class="
          text-xl bg-primary pl-3.5 pr-3 py-1 text-onPrimary font-bold tracking-widest transition-colors
          hover:bg-transparent hover:text-primary
        "
      >进入会场</p>
    </div>
  </div>
</template>